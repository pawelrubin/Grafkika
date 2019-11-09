export class Turtle {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.ctx.lineWidth = '1';
        this.ctx.strokeStyle = 'red'
        this.x_pos = canvas.width / 2;
        this.y_pos = canvas.height / 2;
        this.rotation = 90
        this.draw = true
        Number.prototype.mod = function(n) {
            return ((this % n) + n) % n
        }
    }

    move_to_point(new_x, new_y) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.x_pos, this.y_pos);
        this.ctx.lineTo(new_x, new_y);
        this.ctx.stroke();
        this.x_pos = new_x;
        this.y_pos = new_y;
    }

    move(value) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.x_pos, this.y_pos);
        this.x_pos += value * Math.cos(this.rotation * Math.PI/180);
        this.y_pos -= value * Math.sin(this.rotation * Math.PI/180);
        this.ctx.lineTo(this.x_pos, this.y_pos);
        if (this.draw) this.ctx.stroke();
    }

    rotate(angle) {
        this.rotation = (this.rotation - angle).mod(360)
    }

    parseInput(input) {
        input.split(';').forEach(line => {
            let [command, ...params] = line
                .replace(/\s+/g, ' ')
                .trim()
                .toUpperCase()
                .split(' ');
            this.executeCommand(command, ...params);
        });
    }

    executeCommand(command, ...params) {
        switch (command) {
            case "FORWARD": {
                this.move(params[0]);
                break;
            }
            case "BACKWARD": {
                this.move(-params[0]);
                break;
            }
            case "RIGHT": {
                this.rotate(params[0]);
                break;
            }
            case "LEFT": {
                this.rotate(-params[0]);
                break;
            }
            case "UP": {
                this.draw = false;
                break;
            }
            case "DOWN": {
                this.draw = true;
                break;
            }
            case "REPEAT": {
                for (let i = 0; i < params[0]; i++) {
                    let [subCommand, ...subParams] = params.slice(1)
                    this.executeCommand(subCommand, ...subParams)        
                }
                break;
            }
        }
    }
}
