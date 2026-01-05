---
title: Cracking Solidity Storage with Assembly
description: Encoding and decoding EVM storage structures using Solidity assembly insights.
date: '2023-08-25'
tags:
  - Solidity
  - Assembly
state:
    - Final
published: true
---

# Introduction

This is the post in a series of posts discussing possible solutions for Solidity coding challenges found in the wild.

For this entry, I have chosen a coding challenge by [@NomismaTech](https://github.com/NomismaTech), which requires the use of inline assembly to solve the puzzle. This is timely as I'm currently going throught "The EVM Handbook," which covers EVM opcodes in depth.

This piece explores a potential solution for the problem while reviewing necessary EVM concepts to build it. By the end of it, readers will have a better understanding of how `structs` and dynamic arrays are stored by the EVM, and how Solidity's inline assembly can be used to access storage variables. Additionally, bit of memory manipulation will be covered, but it will not be covered in depth.

# The challenge

The challenge description read as follows:

> Given the following set of contracts the goal is to implement to-bytes and from-bytes converter for structs to be able to pass them from contract to contract in a form of bytes. Please assume that Storage and Controller contracts have different addresses on the network. StructDefiner is never deployed on its own and is used as a part of Storage or Controller.
> 

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StructDefiner {
    struct MyStruct {
        uint256 someField;
        address someAddress,
        uint128 someOtherField
        uint128 oneMoreField
    }
}

contract Storage {
    StructDefiner.MyStruct[] internal structs;

    function getStructByIndex(uint256 index) external view returns (bytes memory) {
        assembly {
            // your code here
        }
    }
}

contract Controller {
    Storage internal storage;

    constructor(addrerss _storage) {
        storage = Storage(_storage);
    }

    getStruct(uint256 index) public returns (StructDefiner.MyStruct myStruct) {
        bytes memory _myStruct = storage.getStructByIndex(index);

        assembly {
            // your code here
        }
    }
}

```

This set of contracts has two main goals, as stated in the body of the challenge: to encode and decode a data structure.
The encoding process should take a `MyStruct` object, based on an index provided by the caller, and return an [array of bytes](https://docs.soliditylang.org/en/v0.8.21/types.html#bytes-and-string-as-arrays) representing that same object.
The decoding function also receives an index, calls the encoding function, and decodes the string of bytes received into a `MyStruct`.

As the primary source of data is a dynamic array of structs, obviously composed of a bytes array and structs, it is necessary to understand how such a data structure is stored by the Ethereum Virtual Machine.

Lets review how each of these pieces are handled by the storage separately, to then understand how they are combined to compose `MyStruct`.

## Dynamic arrays

As the name suggests, dynamic arrays can grow in length as demanded by the smart-contract internal logic. To achieve this behavior and avoid overwriting sections of the storage, that are not part of a specific array, the EVM hashes the storage slot attributed to the array at compile time and uses that value as a storage address for the first element of the array. The rest of the elements in the list will be stored contiguously based on that same address offset. The storage slot assigned to the array will store the length of the list.

Consider the following contract that contains a dynamic array:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DynamicArrayStorage {
    uint128[] public dynamicArray;
}

```

The Figure 1 shows the storage layout for the contract above.

![/post-images/solidity-coding-challenges/DynamicArrayStorage.svg](/post-images/solidity-coding-challenges/DynamicArrayStorage.svg)

*Figure 1 - DynamicArrayStorage contract storage layout*

The image above shows `slot 0` pointing to `slot 0x290de...f3e563`, which is the output of `keccak256(0x0)`, the hash of dynamicArray's slot. Starting from the storage address computed, the next elements of this array will occupy the slots `0x290de...f3e564`, `0x290de...f3e565`, `0x290de...f3e566`, and so on, contiguously.

In the case of `dynamicArray`, each storage slot can hold up to two elements of the list due to [EVM's variable packing](https://fravoll.github.io/solidity-patterns/tight_variable_packing.html). Each slot is 32 bytes long, and the elements of the array are only 16 bytes in length.

## Structs

Structs are a much more predictable type than dynamic arrays when it comes to storage size. Each struct is composed of a finite set of fields, and these fields are treated by the storage handler as regular state variables. Each field is stored in a contiguous storage slot, following the order of declaration on the contract's body. The EVM also tries to pack struct variables together, as it does for arrays and all state variables in general.

Consider the contract below. It declares a struct with three different fields and creates a public variable based on the `CustomStruct`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StructStorage {
    struct CustomStruct {
        uint256 field0;
        uint128 field1;
        uint128 field2;
    }

    CustomStruct public customStruct;
}

```

The Figure 2 represents the storage layout of the `StructStorage` contract above.

![/post-images/solidity-coding-challenges/StructStorage.svg](/post-images/solidity-coding-challenges/StructStorage.svg)

*Figure 2 - StructStorage contract storage layout*

Despite `CustomStruct` declaring three fields, Figure 2 shows that only two storage slots are used to persist such object. Once again, this is variable packing in action. `field0`, which is an `uint256`, is 32 bytes long and takes up a whole storage slot. However, `field1` and `field2` are only 16 bytes long, so they can be packed together in a single slot.

## Dynamic array of structs

Dynamic array of structs combines the two storage techniques seen above. As a dynamic array, the position of the first element is calculated using the hash of the slot where array is declared, and all its elements are stored from that offset. And as a struct, each field is stored in contiguous slots, packing the variables together whenever possible.

The smart contract below defines a dynamic array of structs.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DynamicArrayOfStructsStorage {
    struct CustomStruct {
        uint256 field0;
        uint128 field1;
        uint128 field2;
    }

    CustomStruct[] public dynamicArrayOfStructs;
}

```

The Figure 3 show the storage layout of DynamicArrayOfStructsStorage

![/post-images/solidity-coding-challenges/DynamicArrayOfStructsStorage.svg](/post-images/solidity-coding-challenges/DynamicArrayOfStructsStorage.svg)

*Figure 3 - DynamicArrayOfStructsStorage contract storage layout*

The diagram above is a combination of the ones seen in Figures 1 and 2. Storage `slot 0` points to the output of `keccak256(0x0)`, `0x290de...f3e563`. From that slot, all the fields of `CustomStruct` will be stored in sequence, using two slots in total: one for `field0` and another one for `field1` and `field2`.

Notice how the entity representing the dynamic array defines an offset of `0-1`. This means that the elements, in this case the a `CustomStruct` object, take two slots to store their data when stored in that array.

# Encoding

With all the necessary concepts for the proposed solution laid out, it's time to implement the encoding function. `getStructByIndex` is responsible for the encoding process. It takes an index, representing a struct position in the `structs` list, and expects an array of bytes as the return value.

There are several ways to achieve the same result, but this solution will use Solidity's inline assembly, since it is suggested by the initial implementation. The low-level block will be used to access specific storage offsets to retrieve an instance of `MyStruct` and convert it to the expected output format.

The first step is to determine the storage location of an object within the contract, given an index of the `structs` array. As seen before, the EVM hashes the storage slot allocated to a dynamic array, in order to calculate the first element position in storage. Therefore, that should be the first step.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Storage {
    StructDefiner.MyStruct[] internal structs;

    function getStructByIndex(uint256 index) external view returns (bytes memory) {
        bytes32 structsStorageSlot = hex"00";
        bytes32 initialArrayStorage = keccak256(abi.encodePacked(structsStorageSlot));

        assembly {
        }
    }
}

```

The variable defined above, `initialArrayStorage`, now holds the first storage slot used by `structs`, but there are a couple of things to notice here.

The first thing one might ask is: how is the storage slot used by `structs` defined? Will it always be 0? The answer lies in the [storage layout of state variables](https://docs.soliditylang.org/en/v0.8.21/internals/layout_in_storage.html), a set of rules defined by the Solidity compiler that assigns variables to storage slots according to the order of declaration. In the case of the `Storage` contract, `structs` will always be assigned to slot 0 because it is the first (and only) state variable.

The second thought that may come to mind is: why is `structsStorageSlot` being encoded using `abi.encodePacked` before being passed to `keccak256`? That's due to the signature of the `keccak256` function. It takes a byte array as a parameter, and that is what `abi.encodePacked` returns, so `structsStorageSlot` is passed through that method before being hashed. Bureaucracies of a strongly typed language.

Despite having the address of the first slot being used by `structs`, the content of that storage position is still unknown without further interpretation of the storage layout. That's the next step.

As defined before, a dynamic array of structs utilizes sequential compartments of storage for storing the fields of `structs`, and each struct lives right next to each other in storage.

So to better understand what `initialArrayStorage` represents, further analysis should be conducted on `MyStruct`.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StructDefiner {
    struct MyStruct {
        uint256 someField;
        address someAddress,
        uint128 someOtherField
        uint128 oneMoreField
    }
}

```

Each storage slot is 32 bytes (256 bits), so `someField` occupies a storage slot alone. An `address` type is 20 bytes long (160 bits), although `someAddress` cannot be packed together with `someOtherField`, since it is a `uint128`, and takes 16 bytes to be stored, which will exceed the limit of 32 bytes of a storage cell, therefore it also takes a whole storage slot. The last two fields `someOtherField` and `oneMoreField` are both 16 bytes long, which means they can be packed together into a single slot.

The total amount of storage slots used by each `MyStruct` object is **three**.

Figure 4 shows the storage layout of StructDefiner contract, where is possible to notice the structure mentioned above.

![/post-images/solidity-coding-challenges/StructDefiner.svg](/post-images/solidity-coding-challenges/StructDefiner.svg)

*Figure 4 - StructDefiner contract storage layout*

This gives `getStructByIndex` two pieces of information. First, it tells our function that when calculating the storage position of entries in the `structs` array, an offset of three slots should be taken into consideration to account for each slot used by a `MyStruct`. Second, it provides context for what each one of the storage cells is holding, which will be fundamental for encoding the data.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Storage {
    StructDefiner.MyStruct[] internal structs;

    function getStructByIndex(uint256 index) external view returns (bytes memory) {
        bytes32 structsStorageSlot = hex"00";
        bytes32 initialArrayStorage = keccak256(abi.encodePacked(structsStorageSlot));
        bytes32 storageLocationOfIndex = bytes32(uint256(initialArrayStorage) + (index * 3));

        assembly {
        }
    }
}

```

As the items in the dynamic array are stored sequentially, and so are the struct fields, for each entry of the array, the implementation should "jump" three contiguous slots to reach the memory location where the next item is stored. That is exactly what `storageLocationOfIndex` is calculating: the storage address of an element of the array.

Now, it is possible to start reading data from the contract storage using inline assembly.

The most important assembly instruction for this solution is [SLOAD](https://www.evm.codes/#54?fork=shanghai), which is the instruction used to load 32-byte chunks from the storage to the stack. It takes a single parameter, a storage location, and returns the value stored in that slot.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Storage {
    StructDefiner.MyStruct[] internal structs;

    function getStructByIndex(uint256 index) external view returns (bytes memory) {
        bytes32 structsStorageSlot = hex"00";
        bytes32 initialArrayStorage = keccak256(abi.encodePacked(structsStorageSlot));
        bytes32 storageLocationOfIndex = bytes32(uint256(initialArrayStorage) + (index * 3));

        assembly {
            let structSlot0 := sload(storageLocation)
            let structSlot1 := sload(add(storageLocation, 0x1))
            let structSlot2 := sload(add(storageLocation, 0x2))
        }
    }
}

```

The snippet above reads all the data of a `MyStruct` at the position `index` of `structs`. Notice that `structSlot0` holds the value of `MyStruct.someField`, `structSlot1` holds the value of `MyStruct.someAddress`, and `structSlot2` stores the value of `MyStruct.someOtherField` and `MyStruct.oneMoreField`, since both share the same storage cell.

With all the struct fields loaded, the next step is to encode the data that should be returned from this function.
There are many different encoding formats that could be used in this situation, the most popular ones being `abi.encode` and `abi.encodePacked`. For this implementation, `abi.encode` format was chosen since it requires less byte manipulation to extract the values from the byte array during the decoding phase.

This format returns 32-byte chunks, padded with zeros when a value is shorter than 32 bytes. As the Solidity documentation states, "The encoding is not self-describing and thus requires a schema in order to decode."

To return a byte array from this function, we need to instantiate one in memory. This data structure will hold the fields of `MyStruct` in will be forward back to the function caller.

An byte array create in memory by allocating the desired length of the list in the next free word of memory, and storing the content in the subsequent words of memory. Note that memory deals with arrays in a completely different way than storage does.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Storage {
    StructDefiner.MyStruct[] internal structs;

    function getEncodedStructByIndex(uint256 index) external view returns (bytes memory payload) {
        bytes32 storageLocation = getStorageLocation(index);

        assembly {
            payload := mload(0x40)
            mstore(payload, 0x60)

            let structSlot0 := sload(storageLocation)
            let structSlot1 := sload(add(storageLocation, 0x1))
            let structSlot2 := sload(add(storageLocation, 0x2))

            mstore(add(payload, 0x20), structSlot0)
            mstore(add(payload, 0x40), structSlot1)
            mstore(add(payload, 0x60), structSlot2)
        }
    }
}

```

The code above fetches the free memory pointer from the memory position `0x40`. This memory location always indicates the next free word of memory. Then, it allocates the length of the array in the memory position returned by the free memory pointer, which in this case is 96 or `0x60` in hexadecimal. This is equivalent to the three storage slots used by `MyStruct` instances.

Next, the function allocates the fields read from memory on contiguous memory words. This is done by adding 32 bytes or `0x20` in hexadecimal to the initial `payload` memory address.

However, the code above has a problem. The `structSlot2` holds the value of two fields of `MyStruct`, since they are packed together with the goal of optimizing storage. But the `abi.encode` specification requires that each encoded variable should be 32 bytes long. As a result, `getEncodedStructByIndex` is not returning the expected string of bytes. Further tinkering needs to be done to ensure that the return value of this function matches the specification.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Storage {
    StructDefiner.MyStruct[] internal structs;

    function getEncodedStructByIndex(uint256 index) external view returns (bytes memory payload) {
        bytes32 storageLocation = getStorageLocation(index);

        assembly {
            payload := mload(0x40)
            mstore(payload, 0x80)

            let structSlot0 := sload(storageLocation)
            let structSlot1 := sload(add(storageLocation, 0x1))
            let structSlot2 := sload(add(storageLocation, 0x2))

            let someOtherField := shr(0x80, structSlot2)
            let oneMoreField := and(structSlot2, sub(shl(0x80, 0x1), 0x1))

            mstore(add(payload, 0x20), structSlot0)
            mstore(add(payload, 0x40), structSlot1)
            mstore(add(payload, 0x60), someOtherField)
            mstore(add(payload, 0x80), oneMoreField)
        }
    }
}

```

There are a few notable changes in the function above. The first is an increase in the size of the byte array from `0x60` to `0x80`. This means an increase of 32 bytes to support the encoding method, which requires each field to be represented by a word.

The second addition to the previous code is the manipulation of `structSlot2` to split the storage slot into two 32-byte variables so they can conform to the encoding rules that this function follows. To isolate the value of `someOtherField`, `structSlot2` is shifted 128 bits to the right, overriding the last 16 bytes with the first half of those bytes. And to isolate `oneMoreField`, a mask is applied to `structSlot2` to get rid of the first 16 bytes.

The last step in the encoding process is to update the free memory pointer. Since the contract has modified the memory content, it needs to inform the EVM so it can allocate values in memory correctly while calculating the return value of this function. In the same `0x40` memory offset, the contract allocates the `payload` memory location plus `0xa0`, which indicates the first free memory location after the byte array.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Storage {
    StructDefiner.MyStruct[] internal structs;

    function getEncodedStructByIndex(uint256 index) external view returns (bytes memory payload) {
        assembly {
			//...

            mstore(0x40, add(payload, 0xa0))
        }
    }
}

```

As `getEncodedStructByIndex` is using a named return, it delegates to the EVM the responsibility to calculate the return value.

That's it. Encoding function done.

# Decoding

Decoding is a much simpler process than encoding. Before starting to decode, lets once again analyze the initial implementation of the function provided in the challenge description.

```solidity
contract Controller {
    Storage internal storage;

    constructor(addrerss _storage) {
        storage = Storage(_storage);
    }

    function getStruct(uint256 index) public returns (StructDefiner.MyStruct myStruct) {
        bytes memory _myStruct = storage.getStructByIndex(index);

        assembly {
            // your code here
        }
    }
}
```

Similar to the encoding function, the `getStructByIndex` method is called with an index parameter. The byte array returned from this method is then decoded to a `MyStruct` object, as indicated by the function signature.

Before decoding the string of bytes that this function receives from `getStructByIndex`, it's important to understand how structs are represented in memory. Each field needs to be represented by a word, meaning no variable packing is considered. That is the main reason why the regular ABI encoding format was chosen.

Since the function has already loaded the byte array returned from the encoding function, it is now possible to arrange those chunks in a way that the EVM can interpret as a single struct.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Controller {
    Storage internal storage;

    constructor(addrerss _storage) {
        storage = Storage(_storage);
    }

    function getStruct(uint256 index) public returns (StructDefiner.MyStruct myStruct) {
        bytes memory _myStruct = storage.getStructByIndex(index);

        assembly {
            myStruct := mload(0x40)

            mstore(myStruct, mload(add(encodedStruct, 0x20)))
            mstore(add(myStruct, 0x20), mload(add(encodedStruct, 0x40)))
            mstore(add(myStruct, 0x40), mload(add(encodedStruct, 0x60)))
            mstore(add(myStruct, 0x60), mload(add(encodedStruct, 0x80)))

            mstore(0x40, add(myStruct, 0xa0))
        }
    }
}
```

The first step to start decoding `encodedStruct` is to inform the EVM where in memory the first 32 bytes of our struct are located. This is done by fetching the free memory pointer from the memory position `0x40`.

Next, a process of allocating contiguous chunks of 32 bytes begins, starting at the position indicated by the pointer. Each [MLOAD](https://www.evm.codes/#51?fork=shanghai) operation reads the next unallocated chunk of 32 bytes and positions it next to all other fields in memory. The order of each field in memory is important because the EVM will try to map the memory location in the order of the declaration of each field in `MyStruct`.

At the end of the assembly block, the free memory pointer is updated so that the EVM can keep the execution without overwriting any of the memory locations written above.

And that's the decoding function.

# Conclusion

This challenge requires a considerable amount of knowledge about assembly, which may be overwhelming for readers who are not familiar with how EVM handles storage and memory. However, learning about these concepts is crucial to understand the workings of EVM. To assist these readers, I recommend checking out the [EVM Handbook](https://www.notion.so/The-EVM-Handbook-bb38e175cc404111a391907c4975426d?pvs=21), which is a comprehensive collection of EVM learning resources curated by [Noxx](https://twitter.com/noxx3xxon).

For experienced Solidity developers, I suggest experimenting with the code above and trying different approaches to achieve the same outcome for each function, as there are numerous possibilities.

You can find the [full code here](https://github.com/iankressin/solidity-challenges/tree/main/%40NomismaTech).

In addition, there are always ways to improve the implementation, and I welcome any ideas or suggestions to enhance it. Please do not hesitate to contact me at X [@iankguimaraes](https://x.com/iankguimaraes) to discuss further.
