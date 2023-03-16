console.log("Script is running")

//
//  Pedestal
//

let currentLeftAngle = 0;
let angleSpeed = 5;

let rotOX = 0;
let rotOY = 0;
let rotOZ = 0;

let posX = 0;

let identitiyArray = new Float32Array(16);
let identityMatrix = glMatrix.mat4.identity(identitiyArray);

let topCubeWMatx = new Float32Array(16);
let botCubeWMatx = new Float32Array(16);
let leftCubeWMatx = new Float32Array(16);
let rightCubeWMatx = new Float32Array(16);

let norm = 2;

glMatrix.mat4.translate(topCubeWMatx, identityMatrix, [0, 2, 0]);
glMatrix.mat4.translate(botCubeWMatx, identityMatrix, [0, 0, 0]);
glMatrix.mat4.translate(leftCubeWMatx, identityMatrix, [2, 0, 0]);
glMatrix.mat4.translate(rightCubeWMatx, identityMatrix, [-2, 0, 0]);

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

document.addEventListener('keydown', (event) => {
    let name = event.key;
    let code = event.code;

    if (name == "w")
    {
        currentLeftAngle -= 5;
        glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatx, angle(angleSpeed), [0, 1, 0]);
        glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatx, angle(angleSpeed), [0, 1, 0]);

        //glMatrix.mat4.translate(leftCubeWMatx, identityMatrix, [norm * Math.cos(angle(currentLeftAngle)), 0,norm * Math.sin(angle(currentLeftAngle))]);
        glMatrix.mat4.rotate(leftCubeWMatx, leftCubeWMatx, angle(angleSpeed), [0, 1, 0]);

        //glMatrix.mat4.translate(rightCubeWMatx, identityMatrix, [norm *Math.cos(angle(180 + currentLeftAngle)), 0,norm * Math.sin(angle(180 + currentLeftAngle))]);
        glMatrix.mat4.rotate(rightCubeWMatx, rightCubeWMatx, angle(angleSpeed), [0, 1, 0]);

    }
    if (name == "e")
    {
        currentLeftAngle += 5;
        glMatrix.mat4.rotate(topCubeWMatx, topCubeWMatx, angle(-angleSpeed), [0, 1, 0]);
        glMatrix.mat4.rotate(botCubeWMatx, botCubeWMatx, angle(-angleSpeed), [0, 1, 0]);

        //glMatrix.mat4.translate(leftCubeWMatx, identityMatrix, [norm *Math.cos(angle(currentLeftAngle)), 0, norm *Math.sin(angle(currentLeftAngle))]);
        glMatrix.mat4.rotate(leftCubeWMatx, leftCubeWMatx, angle(-angleSpeed), [0, 1, 0]);

        //glMatrix.mat4.translate(rightCubeWMatx, identityMatrix, [norm *Math.cos(angle(180 + currentLeftAngle)), 0, norm *Math.sin(angle(180 + currentLeftAngle))]);
        glMatrix.mat4.rotate(rightCubeWMatx, rightCubeWMatx, angle(-angleSpeed), [0, 1, 0]);
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
