class Vertex3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Vertex2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Cube {
    constructor(center, size) {
        this.center = center;
        this.size = size;
        const d = size/2;

        this.vertices = [
            new Vertex3D(center.x - d, center.y - d, center.z + d),
            new Vertex3D(center.x - d, center.y - d, center.z - d),
            new Vertex3D(center.x + d, center.y - d, center.z - d),
            new Vertex3D(center.x + d, center.y - d, center.z + d),
            new Vertex3D(center.x + d, center.y + d, center.z + d),
            new Vertex3D(center.x + d, center.y + d, center.z - d),
            new Vertex3D(center.x - d, center.y + d, center.z - d),
            new Vertex3D(center.x - d, center.y + d, center.z + d)
        ];
    
        // Generate the faces
        this.faces = [
            [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
            [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
            [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
            [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
            [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
            [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]
        ];
    }
}


class PerspectiveProjection {
    project(vertex3D, distance) {
        const r = distance / vertex3D.y;
        return new Vertex2D(r * vertex3D.x, r * vertex3D.z);
    }
}

class OrthographicProjection {
    project(vertex3D) {
        return new Vertex2D(vertex3D.x, vertex3D.z);
    }
}

class Camera {
    constructor(position, distance, projection) {
        this.position = position;
        this.distance = distance;
        this.projection = projection;
    }

    project(vertex) {
        return this.projection.project(vertex, this.distance)
    }
}

class Engine {
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.dx = canvas.width / 2;
        this.dy = canvas.height / 2;
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
	    this.ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';
    }


    render(objects, camera) {
        // Clear the previous frame
	    this.ctx.clearRect(0, 0, 2*this.dx, 2*this.dy);
        // For each object
        for (let i = 0, n_obj = objects.length; i < n_obj; ++i) {
            // For each face
            for (let j = 0, n_faces = objects[i].faces.length; j < n_faces; ++j) {
                // Current face
                let face = objects[i].faces[j];
    
                // Draw the first vertex
                let P = camera.project(face[0]);
                this.ctx.beginPath();
                this.ctx.moveTo(P.x + this.dx, -P.y + this.dy);
    
                // Draw the other vertices
                for (let k = 1, n_vertices = face.length; k < n_vertices; ++k) {
                    P = camera.project(face[k]);
                    this.ctx.lineTo(P.x + this.dx, -P.y + this.dy);
                }
    
                // Close the path and draw the face
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.fill();
            }
        }
    }
}

export {Camera, Engine, Vertex2D, Vertex3D, Cube, OrthographicProjection, PerspectiveProjection}