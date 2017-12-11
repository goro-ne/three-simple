=============================
Install
=============================

参考サイト
https://tyablog.net/2017/03/29/typescript-three-js/

### npmのバージョン確認

```
$ npm i -g npm
$ npm --version
5.6.0
```

### 必要なパッケージのインストール

- three (three.js)
- jquery
- webpack
- @types/three (three.jsの型定義)
- @types/jquery (jqueryの型定義)
- ts-load (webpackでTypeScriptコンパイル用)
- typescript
- http-server (簡易HTTPサーバー起動)

```
npm init
npm install --save jquery
npm install --save three
npm install --save-dev http-server
npm install --save-dev webpack
npm install --save-dev ts-loader
npm install --save-dev typescript
npm install --save @types/jquery
npm install --save-dev @types/three
```

### package.jsonの編集

```json
{
  "name": "three-simple",
  "version": "1.0.0",
  "description": "test three.js",
  "main": "index.js",
  "directories": {
    "doc": "docs"
  },
  "scripts": {
    "build": "webpack",
    "test": "http-server"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/goroutine/three-simple.git"
  },
  "author": "goroutine",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/goroutine/three-simple/issues"
  },
  "homepage": "https://github.com/goroutine/three-simple#readme",
  "dependencies": {
    "@types/jquery": "^3.2.16",
    "jquery": "^3.2.1",
    "three": "^0.88.0"
  },
  "devDependencies": {
    "@types/three": "^0.84.35",
    "http-server": "^0.10.0",
    "ts-loader": "^3.2.0",
    "typescript": "^2.6.2",
    "webpack": "^3.10.0"
  }
}
```


### index.html

index.html
```
<html>
    <head>
        <script src="assets/bundle.js"></script>
    </head>

    <body>HELLO</body>
</html>
```

### webpack.config.js

webpack.config.js
```
module.exports = {
    entry: "./app.ts",

    output: {
        filename: "./assets/bundle.js"
    },

    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".js"]
    },

    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader', options: { transpileOnly: true } }
        ]
    }
};
``` 


### app.ts

app.ts
```ts
import $ = require("jquery")
import THREE = require("three");

$(function () {
    let $mainFrame = $("body");

    // シーン、カメラ、レンダラを生成
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, $mainFrame.width() / $mainFrame.height(), 0.1, 1000);
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize($mainFrame.width(), $mainFrame.height());
    camera.position.z = 5;
    camera.position.y = 1;

    // 自動生成されたcanvas要素をdivへ追加する。
    $mainFrame.append(renderer.domElement);

    // ここらへんは好きなオブジェクトをシーンに突っ込んじゃってください。
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    // let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    let material = new THREE.MeshNormalMaterial();

    // Asixヘルパー
    let axisHelper = new THREE.AxisHelper(10);
    scene.add(axisHelper);

    // Gridヘルパー
    let gridHelper = new THREE.GridHelper(20, 5);
    scene.add(gridHelper);

    let cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // コールバック関数 render をrequestAnimationFrameに渡して、
    // 繰り返し呼び出してもらう。
    let render = function () {
        window.requestAnimationFrame(render);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    };
    render();

    $(window).keypress(function (eventObject) {
        if ('h' == eventObject.key){
            camera.rotation.y += 0.01;
        }
        if ('l' == eventObject.key){
            camera.rotation.y -= 0.01;
        }
        if ('j' == eventObject.key){
            camera.rotation.x -= 0.01;
        }
        if ('k' == eventObject.key){
            camera.rotation.x += 0.01;
        }
    });
});
```

### tsconfig.json

tsconfig.json
```json
{
  "compilerOptions": {
  }
}
```

### コンパイル

```
$ npm run build
```

### テスト

```
npm run test
```
