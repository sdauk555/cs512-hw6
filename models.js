function createBox(sx, sy, sz) {
  const positions = new Float32Array([
    -1, -1,  1,   1, -1,  1,   1,  1,  1,  -1,  1,  1,   // front
     1, -1, -1,  -1, -1, -1,  -1,  1, -1,   1,  1, -1,   // back
    -1,  1,  1,   1,  1,  1,   1,  1, -1,  -1,  1, -1,   // top
    -1, -1, -1,   1, -1, -1,   1, -1,  1,  -1, -1,  1,   // bottom
     1, -1,  1,   1, -1, -1,   1,  1, -1,   1,  1,  1,   // right
    -1, -1, -1,  -1, -1,  1,  -1,  1,  1,  -1,  1, -1    // left
  ].map((v, i) => v * [sx, sy, sz][i % 3]));
  const faceNormals = [[0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0]];
  const normals = new Float32Array(faceNormals.flatMap(n => [...n, ...n, ...n, ...n]));

  const texCoords = new Float32Array(faceNormals.flatMap(() => [0, 0, 1, 0, 1, 1, 0, 1]));

  const indices = new Uint16Array([
     0,  1,  2,   0,  2,  3,   // front
     4,  5,  6,   4,  6,  7,   // back
     8,  9, 10,   8, 10, 11,   // top
    12, 13, 14,  12, 14, 15,   // bottom
    16, 17, 18,  16, 18, 19,   // right
    20, 21, 22,  20, 22, 23    // left
  ]);
  return { positions, normals, texCoords, indices };
}

function createCylinder(radius, height, segments) {
  const p = [], n = [], t = [], idx = [];
  const h = height / 2;

  for (let j = 0; j <= segments; j++) {
    const a = 2 * Math.PI * j / segments, c = Math.cos(a), s = Math.sin(a);
    p.push(radius * c, -h, radius * s,  radius * c, h, radius * s);
    n.push(c, 0, s,  c, 0, s);
    t.push(j / segments, 0,  j / segments, 1);
  }
  for (let j = 0; j < segments; j++) {
    const k = 2 * j;
    idx.push(k, k + 2, k + 3,  k, k + 3, k + 1);
  }

  for (const [y, ny] of [[h, 1], [-h, -1]]) {
    const center = p.length / 3;
    p.push(0, y, 0);  n.push(0, ny, 0);  t.push(0.5, 0.5);
    for (let j = 0; j <= segments; j++) {
      const a = 2 * Math.PI * j / segments, c = Math.cos(a), s = Math.sin(a);
      p.push(radius * c, y, radius * s);
      n.push(0, ny, 0);
      t.push(0.5 + 0.5 * c, 0.5 + 0.5 * s);
    }
    for (let j = 0; j < segments; j++) {
      idx.push(center, center + 1 + j + (ny > 0 ? 1 : 0), center + 1 + j + (ny > 0 ? 0 : 1));
    }
  }

  return {
    positions: new Float32Array(p), normals: new Float32Array(n),
    texCoords: new Float32Array(t), indices: new Uint16Array(idx)
  };
}

function createSphere(radius, stacks, slices) {
  const p = [], n = [], t = [], idx = [];
  for (let i = 0; i <= stacks; i++) {
    const phi = Math.PI * i / stacks;
    for (let j = 0; j <= slices; j++) {
      const theta = 2 * Math.PI * j / slices;
      const x = Math.sin(phi) * Math.cos(theta), y = Math.cos(phi), z = Math.sin(phi) * Math.sin(theta);
      p.push(radius * x, radius * y, radius * z);
      n.push(x, y, z);
      t.push(j / slices, 1 - i / stacks);
    }
  }
  for (let i = 0; i < stacks; i++) {
    for (let j = 0; j < slices; j++) {
      const a = i * (slices + 1) + j, b = a + slices + 1;
      idx.push(a, a + 1, b,  a + 1, b + 1, b);
    }
  }
  return {
    positions: new Float32Array(p), normals: new Float32Array(n),
    texCoords: new Float32Array(t), indices: new Uint16Array(idx)
  };
}