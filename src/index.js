console.log("Script is running")

//
//  Pedestal
//

let currentAngle = 0;

let identitiyArray = new Float32Array(16);
let identityMatrix = glMatrix.mat4.identity(identitiyArray);

let topCubeWMatx = new Float32Array(16);
let botCubeWMatx = new Float32Array(16);
let leftCubeWMatx = new Float32Array(16);
let rightCubeWMatx = new Float32Array(16);

let topCubeWMatStart = new Float32Array(16);
let botCubeWMatxStart = new Float32Array(16);
let leftCubeWMatxStart = new Float32Array(16);
let rightCubeWMatxStart = new Float32Array(16);

let leftRad = 2;
let rightRad = 2;

let norm = 2;

glMatrix.mat4.translate(topCubeWMatx, identityMatrix, [0, 2, 0]);
glMatrix.mat4.translate(topCubeWMatStart, identityMatrix, [0, 2, 0]);

glMatrix.mat4.translate(botCubeWMatx, identityMatrix, [0, 0, 0]);
glMatrix.mat4.translate(botCubeWMatxStart, identityMatrix, [0, 0, 0]);

glMatrix.mat4.translate(leftCubeWMatx, identityMatrix, [2, 0, 0]);
glMatrix.mat4.translate(leftCubeWMatxStart, identityMatrix, [2, 0, 0]);

glMatrix.mat4.translate(rightCubeWMatx, identityMatrix, [-2, 0, 0]);
glMatrix.mat4.translate(rightCubeWMatxStart, identityMatrix, [-2, 0, 0]);

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
glMatrix.mat4.lookAt(viewMatrixCube, [0, 0, -9], [0, 0, 0], [0, 1, 0]);
glMatrix.mat4.perspective(projMatrixCube, angle(45), canvas.width / canvas.height, 0.1, 1000.0);

gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
gl.uniformMatrix4fv(matViewLocationCube, false, viewMatrixCube);
gl.uniformMatrix4fv(matProjLocationCube, false, projMatrixCube);

gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

/*let curAngle = 45;

glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatx, angle(curAngle), [0, 1, 0]);
glMatrix.mat4.copy(worldMatrixCube, topCubeWMatx);
gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatx, angle(curAngle), [0, 1, 0]);
glMatrix.mat4.copy(worldMatrixCube, botCubeWMatx);
gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

glMatrix.mat4.translate(leftCubeWMatx,identityMatrix, [leftRad * Math.cos(angle(- curAngle)), 0, leftRad * Math.sin(angle(- curAngle))])
glMatrix.mat4.rotate(leftCubeWMatx, leftCubeWMatx, angle(curAngle), [0, 1, 0]);
glMatrix.mat4.copy(worldMatrixCube, leftCubeWMatx);
gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

glMatrix.mat4.translate(rightCubeWMatx,identityMatrix, [leftRad * Math.cos(angle(180 - curAngle)), 0, leftRad * Math.sin(angle(180 - curAngle))])
glMatrix.mat4.rotate(rightCubeWMatx, rightCubeWMatx, angle(curAngle), [0, 1, 0]);
glMatrix.mat4.copy(worldMatrixCube, rightCubeWMatx);
gl.uniformMatrix4fv(matWorldLocationCube, false, worldMatrixCube);
gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);*/

document.addEventListener('keydown', (event) => {
    let name = event.key;
    let code = event.code;

    if (name == "w")
    {
        currentAngle -= 5;
        glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatStart, angle(currentAngle), [0, 1, 0]);
        glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatxStart, angle(currentAngle), [0, 1, 0]);

        glMatrix.mat4.translate(leftCubeWMatx, identityMatrix, [norm * Math.cos(angle(-currentAngle)), 0, norm * Math.sin(angle(-currentAngle))]);
        glMatrix.mat4.rotate(leftCubeWMatx, leftCubeWMatx, angle(currentAngle), [0, 1, 0]);

        glMatrix.mat4.translate(rightCubeWMatx, identityMatrix, [norm * Math.cos(angle(180 - currentAngle)), 0, norm * Math.sin(angle(180 - currentAngle))]);
        glMatrix.mat4.rotate(rightCubeWMatx, rightCubeWMatx, angle(currentAngle), [0, 1, 0]);

    }
    if (name == "e")
    {
        currentAngle += 5;
        glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatStart, angle(currentAngle), [0, 1, 0]);
        glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatxStart, angle(currentAngle), [0, 1, 0]);

        glMatrix.mat4.translate(leftCubeWMatx, identityMatrix, [norm * Math.cos(angle(-currentAngle)), 0, norm * Math.sin(angle(-currentAngle))]);
        glMatrix.mat4.rotate(leftCubeWMatx, leftCubeWMatx, angle(currentAngle), [0, 1, 0]);

        glMatrix.mat4.translate(rightCubeWMatx, identityMatrix, [norm * Math.cos(angle(180 - currentAngle)), 0, norm * Math.sin(angle(180 - currentAngle))]);
        glMatrix.mat4.rotate(rightCubeWMatx, rightCubeWMatx, angle(currentAngle), [0, 1, 0]);
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
