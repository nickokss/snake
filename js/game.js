;(function() {

    class Random {
        //Crea numeros aleatorios
        static get(inicio, final) {
            return Math.floor(Math.random() * final) + inicio;
        }
    }

    class Mazas {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = 15;
            this.height = 15;

        }

        draw() {

            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        static genera() {
            return new Mazas(Random.get(0, 580), Random.get(0, 380));
        }
    }

    class Cuadrado {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = 15;
            this.height = 15;
            this.back = null; //cuadro de atrás
        }

        dibujar() {
            ctx.fillRect(this.x, this.y, this.width, this.height);
            if (this.hasBack()) {
                this.back.dibujar();
            }
        }
        add() {
            if (this.hasBack()) return this.back.add();
            this.back = new Cuadrado(this.x, this.y);
        }
        hasBack() {
            return this.back !== null;
        }

        copy() {
            if (this.hasBack()) {
                this.back.copy();

                this.back.x = this.x;
                this.back.y = this.y;
            }
        }

        right() {
            this.copy();
            this.x += 15;
        }
        left() {
            this.copy();
            this.x -= 15;
        }
        down() {
            this.copy();
            this.y += 15;
        }
        up() {
            this.copy();
            this.y -= 15;
        }

	//Choque de cabeza con corpo
        hit(cabeza, segundo) {
            segundo = false;
            if (this === cabeza && !this.hasBack()) return false;
            if (this === cabeza) return this.back.hit(cabeza, true);

            if (segundo && !this.hasBack()) return false;
            if (segundo) return this.back.hit(cabeza);

            //Non e nin a cabeza, nin o segundo bloque
            if (this.hasBack()) {
                return cabezaHit(this, cabeza) || this.back.hit(cabeza);
            }


            //Non e a cabeza nin o segundo e  son o ultimo
            return cabezaHit(this, cabeza);
        }

        hitBorder() {
            return this.x > 580 || this.x < 0 || this.y > 380 || this.y < 0;
        }
    }

    class Snake {

        constructor() {
            this.cabeza = new Cuadrado(100, 0);
            this.dibujar();
            this.direcion = "right";
            this.cabeza.add();
            this.cabeza.add();
            this.cabeza.add();
            this.cabeza.add();
            this.cabeza.add();
            this.cabeza.add();
        }

        dibujar() {
            this.cabeza.dibujar();
        }

        right() {
            if (this.direcion === "left") return;
            this.direcion = "right";
        }
        left() {

            if (this.direcion === "right") return;
            this.direcion = "left";
        }
        up() {

            if (this.direcion === "down") return;
            this.direcion = "up";
        }
        down() {

            if (this.direcion === "up") return;
            this.direcion = "down";
        }
        move() {
            if (this.direcion === "up") return this.cabeza.up();
            if (this.direcion === "down") return this.cabeza.down();
            if (this.direcion === "right") return this.cabeza.right();
            if (this.direcion === "left") return this.cabeza.left();
        }

        eat() {
            this.cabeza.add();
        }

        dead() {
            return this.cabeza.hit(this.cabeza) || this.cabeza.hitBorder();
        }
    }


    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var puntos = 0;
    var snake = new Snake();
    var foods = [];

    window.addEventListener("keydown", function(ev) {
        if (ev.keyCode > 36 && ev.keyCode < 41) ev.preventDefault();

        if (ev.keyCode === 40) return snake.down();
        if (ev.keyCode === 39) return snake.right();
        if (ev.keyCode === 38) return snake.up();
        if (ev.keyCode === 37) return snake.left();

        return false;
    });


    var animacion = setInterval(function() {
        snake.move();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snake.dibujar();
        drawMazas();
        ctx.font = "bold 16px architects daughter ";
        ctx.fillStyle = "#000";
        ctx.fillText("PUNTOS: " + puntos, 10, canvas.height - 10);

        if (snake.dead()) {
            ctx.font = "bold 30px architects daughter ";
            ctx.fillStyle = "#006400";
            ctx.fillText("Fin del juego (recarga la web)", 100, 140);
            ctx.fillText("Puntos: " + puntos, 250, 200);
            console.log("FIN DEL JUEGO");
            window.clearInterval(animacion);
        }
    }, 1000 / 15);

    setInterval(function() {
        var food = Mazas.genera();
        foods.push(food);

        setTimeout(function() {
            //Elimina a comida
            borraMazas(food);
        }, 10000);
    }, 4000);


    function drawMazas() {
        for (var index in foods) {
            var food = foods[index];
            if (typeof food !== "undefined") {
                food.draw();

                if (hit(food, snake.cabeza)) {
                    snake.eat();
                    borraMazas(food);
                    puntos++;
                }
            }

        }

    }

    function borraMazas(food) {
        foods = foods.filter(function(f) {
            return food != f;
        });
    }

    function cabezaHit(cuadrado_1, cuadrado_2) {
        return cuadrado_1.x == cuadrado_2.x && cuadrado_1.y == cuadrado_2.y;
    }

    function hit(a, b) {
        var hit = false;
        //colisions horizontales
        if (b.x + b.width >= a.x && b.x < a.x + a.width) {
            //colisions Verticales
            if (b.y + b.height >= a.y && b.y < a.y + a.height) {
                hit = true;
            }
        }

        //colision de a con b
        if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
            if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
                hit = true;
            }
        }
        //colision de b con a
        if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
            if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
                hit = true;
            }
        }
        return hit;
    }
})();
