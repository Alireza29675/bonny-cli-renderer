const RenderKid = require('renderkid')
const child_process = require('child_process');
const style = require('./style.js');

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

  log( message ) {
    console.log(this.r.render(message));
  }

}

module.exports = new CLI()
