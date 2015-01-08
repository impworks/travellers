class Util {

    static cellPosition(cellX: number, cellY: number): Phaser.Point {

        /// <summary>Returns the center of the cell relative to top left screen corner.</summary>

        return new Phaser.Point(
            (Math.round(cellX) + 0.5) * Constants.CELL_SIZE + Constants.FIELD_OFFSET,
            (Math.round(cellY) + 0.5) * Constants.CELL_SIZE + Constants.FIELD_OFFSET
        );
    }

    static getDirection(x1: number, y1: number, x2: number, y2: number): Direction {

        /// <summary>Calculates the direction between two points.</summary>
        /// todo: throw an exception maybe?

        if (x1 > x2) return Direction.Left;
        if (x1 < x2) return Direction.Right;
        if (y1 > y2) return Direction.Up;
        if (y1 < y2) return Direction.Down;
    }

    static getMovement(x1: number, y1: number, x2: number, y2: number): { dir: Direction; distance: number } {

        /// <summary>Returns the direction and distance between two points (in cell coordinates).</summary>

        return {
            dir: Util.getDirection(x1, y1, x2, y2),
            distance: Math.abs(x1 - x2 || y1 - y2)
        };
    }

    static create2DArray<T>(x: number, y: number, value: T): T[][]{

        /// <summary>Creates a 2-dimensional array of specified sizes.</summary>

        var result = [];
        for (var idx = 0; idx < y; idx++) {
            var temp = [];
            for (var idx2 = 0; idx2 < x; idx2++) {
                temp.push(value);
            }
            result.push(temp);
        }
        return result;
    }

    static isInside(xPoint: number, yPoint: number, xTop: number, yTop: number, width?: number, height?: number) {
        
        /// <summary>Checks if the point is inside the specified rectangle.</summary>

        width = width || Constants.CELLS_HORIZONTAL;
        height = height || Constants.CELLS_VERTICAL;

        return xPoint >= xTop
            && yPoint >= yTop
            && xPoint < xTop + width
            && yPoint < yTop + height;

    }

    static log2DArray<T>(value: T[][]) {

        /// <summary>Outputs the 2D array in a readable manner.</summary>

        var result = '';
        value.forEach(x1 => {
            x1.forEach(x2 => result += x2);
            result += "\n ";
        });
        console.log(result);
    }

    static getPointer(input: Phaser.Input): Phaser.Pointer {

        /// <summary>Returns the active pointer.</summary>

        return input.pointer1.active ? input.pointer1 : input.mousePointer;
    }

    static getDirectionVector(dir: Direction): Phaser.Point {
        
        /// <summary>Returns the eigenvector corresponding to current direction.</summary>

        var x = 0,
            y = 0;

        if (dir === Direction.Left)
            x--;
        else if (dir === Direction.Right)
            x++;
        else if (dir === Direction.Up)
            y--;
        else if (dir === Direction.Down)
            y++;

        return new Phaser.Point(x, y);
    }
}  