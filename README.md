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
        - [Board build](#board-build)
        - [FTDI chip setup](#ftdi-chip-setup)
        - [Firmware upload](#firmware-upload)
    - [From an Arduino board](#from-an-arduino-board)
        - [Board setup](#board-setup)
          - [Arduino Uno]()
          - [Arduino Pro Mini]()
        - [Firmware upload](#firmware-upload)
    - [Programmer wiring](#programmer-wiring)
- [Using the VSCode module](#using-the-vscode-module)
    - [Installation](#from-a-pcb)
    - [Usage](#from-an-arduino-board)
    - [Commands](#from-an-arduino-board)
- [Links](#links)

---

## About

The project aims to provide a cross-platform replacement for the SpinAsm software in the form of a module for the Microsoft VSCode editor. The cross-compilation part is done by the alternate [asfv1](https://github.com/ndf-zz/asfv1) assembler, the compiled programs are then sent to an in-circuit EEPROM by either an ATMEL AVR based programmer or a simple Arduino board.

To get started, all you need is to install the module and build a programmer.

---

## Building a programmer

### From a PCB

A quick note about the current version of the PCB : there are some tight tolerances around the ICSP header mounting holes used to fix the SOIC clamp. Check your manufacturer's capabilities as you need a 0.25mm tolerance from non-plated thru hole to track. I've used JLCPCB's services to build it with no issues.

#### Board build

You can find the current gerber files [here](https://github.com/effectspcbs/vscode-spinasm/tree/master/assembly/Gerbers), there are two versions available :

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

<br />

#### FTDI chip setup

The board is powered by the target circuit so you need to set the correct CBUS bits for the *VBUS_SENSE* pin and the RX/TX LEDs if you choose to include them in your build. This is done using the FT_PROG utility from FTDI. it's pretty straightforward to use : power the board, connect it to a computer via USB and set the correct bits :

<p align="center">
  <br />
  <img src="_images/ftprog.png">
</p>
<br />

#### Firmware upload

The PCB uses the [SOICbite](https://github.com/SimonMerrett/SOICbite) footprint as an ICSP header, the pinout on the board is as follow :

<p align="center">
  <br />
  <img src="_images/icsp.png">
</p>
<br />

Which out of my SOIC clamp translates to :

<br />
<img align="left" src="_images/iscp_female.jpg" width="347" height="382">

Pin | ICSP pin
--- | --- 
1 | RST
2 | +3.3V
3 | SCK
4 | *NC*
5 | MISO
6 | *NC*
7 | MOSI
8 | GND

<br />

The project uses VSCode and the PlatformIO module as a development environment, the repository is setup to upload the firmware via a generic AVRISP MKII programmer and target an ATMEGA328PB running at 12Mhz from an external crystal :

```ini
[env:ATmega328P]
platform = atmelavr
board = ATmega328PB
framework = arduino
board_build.mcu = ATmega328PB
board_build.f_cpu = 12000000L
board_hardware.oscillator = external
board_upload.speed = 57600

upload_protocol = stk500v2
upload_flags =
    -Pusb
```
The next step is to set the fuse bits :

`platformio run --target fuses`

And finally upload the firmware :

`platformio run --target program`


### From an Arduino board

As there are many flavors of Arduino boards i will use two examples : the extremelly common Arduino Uno that we probably all have laying around and what i suppose would the ideal board for that purpose, the Arduino Pro Mini running at 3.3V.

<br />

#### Board setup

<br />

#### Arduino Uno

The Arduino Uno is not the ideal candidate for that very specific purpose as in most incarnation it will run off a 5V power supply while the target EEPROM will run at 3.3V. But it has to be the most common Arduino board out there so why not use it, all we need to make it talk the EEPROM are simple level shifters. They are available as pre-made board but are really simple circuits :

<p align="center">
  <br />
  <img src="_images/levelshift.png">
</p>
<br />

Then the following are used to program the target circuit :

<p align="center">
  <br />
  <img src="_images/uno.png">
</p>
<br />

#### Arduino Pro Mini

<br />

#### Firmware upload

Simply setup the platformio.ini as follows, for the Uno :

```ini
[env:uno]
platform = atmelavr
framework = arduino
board = uno
```

Pro Mini :

```ini
[env:pro8MHzatmega328]
platform = atmelavr
framework = arduino
board = pro8MHzatmega328
```

And upload the firmware :

`platformio.exe run --target upload`

<br />

---

## Using the VSCode module

---

## Links