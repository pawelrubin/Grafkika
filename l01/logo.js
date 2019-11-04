class Logo {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.ctx.lineWidth = "5";
        this.x_pos = canvas.width / 2;
        this.y_pos = canvas.height / 2;
    }

    setCoords(new_x, new_y) {
        this.x_pos = new_x;
        this.y_pos = new_y;
    }

    move(new_x, new_y) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.x_pos, this.y_pos);
        this.ctx.lineTo(new_x, new_y);
        this.ctx.stroke();
        this.setCoords(new_x, new_y)
    }

}

window.addEventListener('load', () => {
    const logoCanvas = document.getElementById("logoCanvas");
    const controlInput = document.getElementById("controlInput");
    const logo = new Logo(logoCanvas)
    logo.move(100, 100)
    logo.move(100, 620)
    logo.move(360, 360)

    console.log(logoCanvas);
    console.log(logo)
})