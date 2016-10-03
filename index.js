const RenderKid = require('renderkid')
const child_process = require('child_process');
const readlineSync = require('readline-sync');

const style = require('./style');

class CLI {

  constructor()
  {
    this.initialize();
  }

  initialize() {
    this.r = new RenderKid();
    this.r.style(style);

    this.execCmd = child_process.exec;
    this.spawnCmd = child_process.spawn;
  }

  exec( cmdObj, callback ) {
    const that = this;
    const command = {
      onerror: (error)=> {
        that.cli.log(`<error> ${error} </error>`);
      },
      onsuccess: ()=> {}
    }

    if(typeof cmdObj == "string") command.command = cmdObj;
    else Object.assign(command, cmdObj);

    if(typeof callback == "function") command.onsuccess = callback;

    this.execCmd(command.command, {
      encoding: 'utf8',
      maxBuffer: 1000*1024
    }, (error, stdout, stderr) => {
        if (error) { command.onerror.call(error); return; }
        command.onsuccess.call();
    });
  }

  runtimeExec( cmdObj, onData ) {
    const that = this;
    const command = {
      onerror: (error)=> {
        that.log(`<error> ${error} </error>`);
      },
      ondata: (data)=> {
        that.log(`<message>${data}</message>`);
      }
    }
    if(typeof cmdObj == "string") command.command = cmdObj;
    else Object.assign(command, cmdObj);

    if(typeof onData == "function") command.ondata = onData;

    command.command = command.command.split(" ");

    const runtime = this.spawnCmd(command.command[0], command.command.slice(1));
    runtime.stdout.on('data', command.ondata);
    runtime.stderr.on('data', command.onerror);
  }

  render( message ) {
    return this.r.render(message);
  }

  log( message ) {
    console.log(this.render(message));
  }

  ask( message, type, options ) {
    const that = this;
    var ret;
    if(typeof type == "object") {
      options = type;
      type = undefined;
    }
    options = options ? options : {};
    type = type ? type : "text";
    if(type != "select" && options.default != undefined) message += ` (default: ${options.default}) >`
    message = this.render(`<ask>🤔 ${message}</ask>`);
    switch (type.toLowerCase()) {
      case 'yn':
        ret = readlineSync.keyInYN(message);
        break;
      case 'select':
        var ret, _optionText;
        console.log(message);
        for (const i in options.items) {
            _optionText = `[${parseInt(i)+1}] ${options.items[i]}`;
            if(options.default) {
              _optionText += i == options.default-1 ? " (default)" : "";
            }
            that.log(`<option>${_optionText}</option>`)
        }
        readlineSync.promptLoop(function(input) {
          input = Math.floor(input);
          input = input==0 && options.default != undefined ? options.default : input;
          const cond = (options.items.length >= input && input > 0 ) || (input == 0 && options.default != undefined);
          if(!cond) that.log(`<error>Please enter something in options</error>`);
          else ret = input - 1;
          return cond;
        });
        ret = options.items[ret];
        break;
      case 'password':
        ret = readlineSync.question(message, {
          hideEchoBack: true
        });
      case 'text':
      default:
        var ans = readlineSync.question(message);
        if(ans == "" && options.default != undefined) ans = options.default
        ret = ans;
    }
    that.log(`<option>> ${ret}</option>`);
    return ret;
  }

}

module.exports = new CLI()
