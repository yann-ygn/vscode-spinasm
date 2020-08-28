import SerialPort from 'serialport';

class SequentialSerial {

    // Returns a promise that resolves once the serial port is open and ready.
    // The timeout value specifies how long future calls to read() will wait
    // for data before throwing an exception
    open(port, baud, timeout = 1000) {
        //this.dec     = new TextDecoder();
        this.timeout = timeout;
        return new Promise((resolve, reject) => {
            this.serial = new SerialPort(port, {baudRate: baud, autoOpen: true});
            this.serial.on("open",  err => {if(err) reject(err); else resolve();});
        });
    }

    // Returns a promise that resolves once all output data has been written
    flush() {
        return new Promise((resolve, reject) => {
            this.serial.drain(resolve);
        });
    }

    // Returns a promise that resolves after some data has been written
    write(data) {
        return new Promise((resolve, reject) => {
            const okayToProceed = this.serial.write(data);
            if(okayToProceed) {
                resolve();
            } else {
                this.serial.drain(resolve);
            }
        });
    }
    
    // Returns a promise which resolves when "len" bytes have been read.
    // If encoding is "utf8", a string will be returned.
    read(len, encoding) {
        this.readStart = Date.now();
        const tryIt = (serial, resolve, reject) => {
            var result = this.serial.read(len);
            if(result) {
                if(encoding == 'utf8') {
                    //result = this.dec.decode(result);
                }
                resolve(result);
            } else {
                if(Date.now() - this.readStart > this.timeout) {
                    reject("SerialTimeout");
                } else {
                    // Using setTimeout here is crucial for allowing the I/O buffer to refill
                    setTimeout(() => tryIt(this.serial, resolve, reject), 0);
                }
            }
        }
        return new Promise((resolve, reject) => {
            tryIt(this.serial, resolve, reject);
        });
    }
    
    // Returns a promise that resolves after a certain number of miliseconds.
    wait(ms) {
        return new Promise((resolve, reject) => {setTimeout(resolve,ms);});
    }
}