# vscode-spimasm

A suite of tools that aim to allow the writing of programs for the Spin Semicondutor's FV1 chip and their programming into an in-circuit EEPROM directly from VSCode. The idea being able to move completely from the SpinASM IDE to a modern cross-platform editor.

The cross-platform compilation is made possible by the alternate [asfv1](https://github.com/ndf-zz/asfv1) compiler. The programs are then sent to an in-circuit EEPROM by a custom arduino based programmer.

This repository is divided into the following folders :

* [software](https://github.com/effectspcbs/vscode-spinasm/tree/master/software) : The VSCode module.
* [hardware](https://github.com/effectspcbs/vscode-spinasm/tree/master/hardware) : Altium sources for the programmer's PCB.
* [firmware](https://github.com/effectspcbs/vscode-spinasm/tree/master/firmware/spinasm) : C++ sources for the programmer's firmware.
* [assembly](https://github.com/effectspcbs/vscode-spinasm/tree/master/assembly) : Programmer assembly resources.

