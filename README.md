<br />
<p align="center">
  <a href="https://github.com/effectspcbs/vscode-spinasm">
    <img src="_images/icon.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">VSCode-SpinASM</h3>

  <p align="center">
    A set of tools to work with the Spinsemi FV-1 chip from VSCode.
    <br />
    <a href="https://github.com/effectspcbs/vscode-spinasm/tree/master/software">VSCode module</a>
    ·
    <a href="https://github.com/effectspcbs/vscode-spinasm/tree/master/hardware">Programmer</a>
    ·
    <a href="https://github.com/effectspcbs/vscode-spinasm/tree/master/firmware/spinasm">Programmer's firmware</a>
    ·
    <a href="https://github.com/effectspcbs/vscode-spinasm/tree/master/assembly">Assembly resources</a>
  </p>
</p>
<br />

---

### Table of content

- [About](#about)
- [Building a programmer](#building-a-programmer)
    - [From a PCB](#from-a-pcb)
    - [From an Arduino board](#from-an-arduino-board)
- [Using the VSCode module](#using-the-vscode-module)
    - [Installation](#from-a-pcb)
    - [Commands](#from-an-arduino-board)
- [Links](#links)

---

## About

The project aims to provide a cross-platform replacement for the SpinAsm software in the form of a module for the Microsoft VSCode editor. The cross-compilation part is done by the alternate [asfv1](https://github.com/ndf-zz/asfv1) assembler, the compiled programs are then sent to an in-circuit EEPROM by either an ATMEL AVR based programmer or a simple Arduino board.

To get started, all you need is to install the module and build a programmer.

---

## Building a programmer

### From a PCB

You can find the current version gerber files [here](https://github.com/effectspcbs/vscode-spinasm/tree/master/assembly/Gerbers), there are two available :

* Panel

A 150x100mm panel with mounting holes meant to be built using a stencil and this [support tool](https://github.com/effectspcbs/Parts/blob/master/Stencil%20support/support_2.STL).

<p align="center">
  <br />
  <img align="center" src="_images/panel.png">
</p>
<br />

* Single

A single board to hand solder.

<p align="center">
  <br />
  <img src="_images/single.png">
</p>
<br />

It is a very simple circuit that is basically a slimmed-down arduino board composed of a FTDI USB to UART chip and an AVR microcontroller, you can find the BOM [here](https://github.com/effectspcbs/vscode-spinasm/blob/master/assembly/BOM/BOM.xlsx).

The PCB use the [SOICbite](https://github.com/SimonMerrett/SOICbite) footprint as an ICSP header, the pinout on the board is as follow :

<p align="center">
  <br />
  <img src="_images/icsp.png">
</p>
<br />

Which out of my SOIC clamp translates to :

<img align="left" src="_images/iscp_female.jpg">

Pin | ICSP pin
--- | --- 
Test | Test2



### From an Arduino board

---

## Using the VSCode module

---

## Links