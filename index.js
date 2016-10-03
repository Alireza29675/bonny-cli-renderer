const RenderKid = require('renderkid')

class CLI {

  constructor()
  {
    this.r = new RenderKid();
    this.r.style({
      "title": {
        display: "block",
        margin: "1 0 1"
      },
      "highlight": {
        marginRight: "1",
        marginLeft: "1",
        color: "bright-yellow"
      },
      "error": {
        display: "block",
        color: "black",
        background: "red",
        bullet: '"  ❌ "'
      },
      "message": {
        display: "block",
        color: "bright-cyan",
        bullet: '"  👉 "',
        margin: "0 3 1"
      },
      "success": {
        display: "block",
        color: "bright-green",
        bullet: '"  ✅ "',
        margin: "0 3 1"
      }
    });
  }

  log( message ) {
    console.log(this.r.render(message));
  }

}

module.exports = new CLI()
