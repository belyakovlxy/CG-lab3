console.log("Script is running")

//
//  Pedestal
//


let identitiyArray = new Float32Array(16);
let identityMatrix = glMatrix.mat4.identity(identitiyArray);

let topCubeWMatx = new Float32Array(16);
let botCubeWMatx = new Float32Array(16);
let leftCubeWMatx = new Float32Array(16);
let rightCubeWMatx = new Float32Array(16);

let topCubeWMatxStart = new Float32Array(16);
let botCubeWMatxStart = new Float32Array(16);
let leftCubeWMatxStart = new Float32Array(16);
let rightCubeWMatxStart = new Float32Array(16);

let leftRad = 2;
let rightRad = 2;

let currentPositionAngle = 0;
let currentRotationAngle = 0;
let currentCenterAngle = 0;

let posX = 4;
let posY = -2;
let posZ = 2;

let norm = 2;

glMatrix.mat4.translate(topCubeWMatx, identityMatrix, [0 + posX, 2 + posY, 0 + posZ]);
glMatrix.mat4.translate(topCubeWMatxStart, identityMatrix, [0 + posX, 2 + posY, 0 + posZ]);

glMatrix.mat4.translate(botCubeWMatx, identityMatrix, [0 + posX, 0 + posY, 0 + posZ]);
glMatrix.mat4.translate(botCubeWMatxStart, identityMatrix, [0 + posX, 0 + posY, 0 + posZ]);

glMatrix.mat4.translate(leftCubeWMatx, identityMatrix, [2 + posX, 0 + posY, 0 + posZ]);
glMatrix.mat4.translate(leftCubeWMatxStart, identityMatrix, [2 + posX, 0 + posY, 0 + posZ]);

glMatrix.mat4.translate(rightCubeWMatx, identityMatrix, [-2 + posX, 0 + posY, 0 + posZ]);
glMatrix.mat4.translate(rightCubeWMatxStart, identityMatrix, [-2 + posX, 0 + posY, 0 + posZ]);

let canvas = document.getElementById("pedestal");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

initWebGl(canvas);
console.log(gl)

//
//  Bind shader
//

let shaderProgram = initShaderProgram(gl, vsSource, fsSource);
gl.useProgram(shaderProgram);

//
//  Bind cube buffer
//

initBuffer(gl, cubeVertices, gl.ARRAY_BUFFER, Float32Array);
initBuffer(gl, cubeIndices, gl.ELEMENT_ARRAY_BUFFER, Uint16Array);

//
//  Set buffer data to attributes
//

let positionAttribLocationCube = enableVertexAttrib(
    shaderProgram,
    "vertPositions",
    3, 6, 0);
gl.enableVertexAttribArray(positionAttribLocationCube);

let colorAttribLocationCube = enableVertexAttrib(
    shaderProgram,
    "vertColor",
    3, 6, 3);
gl.enableVertexAttribArray(colorAttribLocationCube);

let matWorldLocationCube = gl.getUniformLocation(shaderProgram, "mWorld");
let matViewLocationCube = gl.getUniformLocation(shaderProgram, "mView");
let matProjLocationCube = gl.getUniformLocation(shaderProgram, "mProj");

let worldMatrixCube = new Float32Array(16);
let viewMatrixCube = new Float32Array(16);
let projMatrixCube = new Float32Array(16);

glMatrix.mat4.identity(worldMatrixCube)
glMatrix.mat4.lookAt(viewMatrixCube, [0, 0, -20], [0, 0, 0], [0, 1, 0]);
glMatrix.mat4.perspective(projMatrixCube, angle(45), canvas.width / canvas.height, 0.1, 1000.0);

gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
gl.uniformMatrix4fv(matViewLocationCube, false, viewMatrixCube);
gl.uniformMatrix4fv(matProjLocationCube, false, projMatrixCube);

gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


document.addEventListener('keydown', (event) => {
    let name = event.key;
    let code = event.code;

    function rotatePedestal() {
        glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatxStart, angle(currentRotationAngle), [0, 1, 0]);
        glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatxStart, angle(currentRotationAngle), [0, 1, 0]);

        glMatrix.mat4.translate(leftCubeWMatx, identityMatrix, [norm * Math.cos(angle(-currentPositionAngle)) + posX, 0 + posY, norm * Math.sin(angle(-currentPositionAngle)) + posZ]);
        glMatrix.mat4.copy(leftCubeWMatxStart, leftCubeWMatx);
        glMatrix.mat4.rotate(leftCubeWMatx, leftCubeWMatx, angle(currentRotationAngle), [0, 1, 0]);

        glMatrix.mat4.translate(rightCubeWMatx, identityMatrix, [norm * Math.cos(angle(180 - currentPositionAngle)) + posX, 0 + posY, norm * Math.sin(angle(180 - currentPositionAngle)) + posZ]);
        glMatrix.mat4.copy(rightCubeWMatxStart, rightCubeWMatx);
        glMatrix.mat4.rotate(rightCubeWMatx, rightCubeWMatx, angle(currentRotationAngle), [0, 1, 0]);
    }

    function getCenterRadiusY(matrix)
    {
        return Math.sqrt(Math.pow(matrix[12], 2) + Math.pow(matrix[14], 2))
    }

    function  getCurrentAngle(matrix)
    {
        console.log(matrix[12] , matrix[14])
        if (matrix[14] == 0 && matrix[12] >= 0)
            return angle(0);
        else if (matrix[14] == 0 && matrix[12] < 0)
            return angle(180);
        else if (matrix[12] == 0)
            return angle(-90);

        let ang = Math.atan(matrix[12] / matrix[14]);
        if (matrix[14] > 0 &&  matrix[12] > 0)
            return angle(-90) + ang ;
        else if (matrix[14] < 0 && matrix[12] > 0)
            return angle(180) + ang;
        else if (matrix[14] > 0 && matrix[12] < 0)
            return angle(-90) + ang;
        else if (matrix[14] < 0 && matrix[12] < 0)
            return - ang;
    }


    if (name == "w")
    {
        currentRotationAngle -= 5;
        currentPositionAngle -= 5;
        rotatePedestal();

    }
    if (name == "e")
    {
        currentRotationAngle += 5;
        currentPositionAngle += 5;
        rotatePedestal();
    }
    if (name == "q")
    {
        currentRotationAngle += 5;
        glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatxStart, angle(currentRotationAngle), [0, 1, 0]);
        glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatxStart, angle(currentRotationAngle), [0, 1, 0]);
        glMatrix.mat4.rotate(leftCubeWMatx, leftCubeWMatxStart, angle(currentRotationAngle), [0, 1, 0]);
        glMatrix.mat4.rotate(rightCubeWMatx, rightCubeWMatxStart, angle(currentRotationAngle), [0, 1, 0]);
    }
    if (name == "r")
    {
        currentCenterAngle += 5;
        let rad;
        let ang;
        rad = getCenterRadiusY(topCubeWMatxStart)
        ang = getCurrentAngle(topCubeWMatxStart)
        console.log(rad, ang);
        glMatrix.mat4.translate(topCubeWMatx, identityMatrix, [rad * Math.cos(angle(-currentCenterAngle) - ang), topCubeWMatx[13], rad * Math.sin(angle(-currentCenterAngle) - ang)]);
        glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatx, angle(currentCenterAngle), [0, 1, 0]);

        rad = getCenterRadiusY(botCubeWMatxStart)
        ang = getCurrentAngle(botCubeWMatxStart)
        console.log(rad, ang);
        glMatrix.mat4.translate(botCubeWMatx, identityMatrix, [rad * Math.cos(angle(-currentCenterAngle) - ang), botCubeWMatx[13],  rad * Math.sin(angle(-currentCenterAngle) - ang)]);
        glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatx, angle(currentCenterAngle), [0, 1, 0]);

        rad = getCenterRadiusY(leftCubeWMatxStart)
        ang = getCurrentAngle(leftCubeWMatxStart)
        console.log(rad, ang);
        glMatrix.mat4.translate(leftCubeWMatx, identityMatrix, [rad * Math.cos(angle(-currentCenterAngle) - ang), leftCubeWMatx[13],  rad * Math.sin(angle(-currentCenterAngle) - ang)]);
        glMatrix.mat4.rotate(leftCubeWMatx, leftCubeWMatx, angle(currentCenterAngle), [0, 1, 0]);

        rad = getCenterRadiusY(rightCubeWMatxStart)
        ang = getCurrentAngle(rightCubeWMatxStart)
        console.log(rad, ang);
        glMatrix.mat4.translate(rightCubeWMatx, identityMatrix, [rad * Math.cos(angle(-currentCenterAngle) - ang), rightCubeWMatx[13],  rad * Math.sin(angle(-currentCenterAngle) - ang)]);
        glMatrix.mat4.rotate(rightCubeWMatx, rightCubeWMatx, angle(currentCenterAngle), [0, 1, 0]);
    }
    console.log(`Key pressed ${name} \r\n Key code value: ${code}`);
}, false);



let loop = () =>

{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    glMatrix.mat4.copy(worldMatrixCube, topCubeWMatx);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

    glMatrix.mat4.copy(worldMatrixCube, botCubeWMatx);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

    glMatrix.mat4.copy(worldMatrixCube, leftCubeWMatx);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

    glMatrix.mat4.copy(worldMatrixCube, rightCubeWMatx);
    gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
