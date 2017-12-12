# インストール 

### npmのバージョン確認

```
$ npm i -g npm
$ npm --version
5.6.0
```

### 方針

- ES2015、Three.jsを使い、WebGLで3Dモデルをアニメーションさせる。
- ES2015で動作しないブラウザを考慮して、webpack3でES5にコンパイルする。

### ES2015のブラウザ対応状況

http://kangax.github.io/compat-table/es6/

- Chromeは62以降
- iOS 10.3以降
- Android はまだ？



### 実行環境

参考サイト  
https://knooto.info/webpack-threejs/

```
project /
　├ package.json
　├ webpack.config.js
　├ assets /
　│ └ bundle.js
　├ app.js
　└ index.html
```

### npmパッケージ初期化

```
npm init -y
```


### webpackのインストール

```
npm install webpack -g
npm install webpack --save-dev
+ webpac@1.0.1
```

### babelのインストール

```
npm install babel-loader babel-core babel-preset-es2015 --save-dev
+ babel-preset-es2015@6.24.1
+ babel-loader@7.1.2
+ babel-core@6.26.0
```

### three.jsのインストール

```
npm install --save three
+ three@0.88.0
```


### webpack.config.jsの編集

*webpack.config.js*
```js
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './app.js', // 入力元のファイル名(エントリポイント)
  output: {
    filename: 'assets/bundle.js' // 出力先のファイル名
  },
  resolve: {
    extensions: [".js", ".jsx"],
    // 使用したいコントロールやレンダラを定義しておきます。(下記は一例です。使用しないものは除いておいてよいです)
    alias: {
        // トラックボール
        'three/TrackballControls': path.join(__dirname, 'node_modules/three/examples/js/controls/TrackballControls.js'),
        // 物体ドラッグ
        'three/DragControls': path.join(__dirname, 'node_modules/three/examples/js/controls/DragControls.js'),
        //// カメラ制御
        //'three/OrbitControls': path.join(__dirname, 'node_modules/three/examples/js/controls/OrbitControls.js'),
    }
  },
  plugins: [
    // THREE.Scene などの形式で three.js のオブジェクトを使用できるようにします。
    new webpack.ProvidePlugin({
        'THREE': 'three/build/three'
    }),
    // minify するようにします。(必要な場合)
    new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}
```


### webpackでコンパイルテスト

```
$ webpack --display-error-details
Hash: 86fa21527e0727984458
Version: webpack 3.10.0
Time: 414ms
      Asset     Size  Chunks             Chunk Names
./js/app.js  3.03 kB       0  [emitted]  js
   [0] ./js/entry.js 376 bytes {0} [built]
   [1] ./js/print.js 74 bytes {0} [built]
```

### package.jsonの編集

npmコマンドを追加
>- npm run test
>- npm run build

*package.json*
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

*index.html*
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>
        body {
            margin: 0px;
            overflow: hidden;
        }
    </style>
    <title></title>
</head>
<body>
    <script src="assets/bundle.js"></script>
</body>
</html>
```


### app.js

*app.js*
```js
import 'three/TrackballControls'; // 必要なコントロール (webpack.config.js に記載したもの) を import します。
import 'three/DragControls';

var container;
var camera, controls, scene, renderer;
var objects = [];

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    scene = new THREE.Scene();

    scene.add( new THREE.AmbientLight( 0x505050 ) );

    var light = new THREE.SpotLight( 0xffffff, 1.5 );
    light.position.set( 0, 500, 2000 );
    light.castShadow = true;

    light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 200, 10000 ) );
    light.shadow.bias = - 0.00022;

    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    scene.add( light );

    var geometry = new THREE.BoxGeometry( 40, 40, 40 );

    for ( var i = 0; i < 200; i ++ ) {

        var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

        object.position.x = Math.random() * 1000 - 500;
        object.position.y = Math.random() * 600 - 300;
        object.position.z = Math.random() * 800 - 400;

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;

        object.scale.x = Math.random() * 2 + 1;
        object.scale.y = Math.random() * 2 + 1;
        object.scale.z = Math.random() * 2 + 1;

        object.castShadow = true;
        object.receiveShadow = true;

        scene.add( object );

        objects.push( object );

    }

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.sortObjects = false;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    container.appendChild( renderer.domElement );

    var dragControls = new THREE.DragControls( objects, camera, renderer.domElement );
    dragControls.addEventListener( 'dragstart', function ( event ) { controls.enabled = false; } );
    dragControls.addEventListener( 'dragend', function ( event ) { controls.enabled = true; } );

    var info = document.createElement( 'div' );
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = '<a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> webgl - draggable cubes';
    container.appendChild( info );

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    controls.update();

    renderer.render( scene, camera );

}
```

### コンパイル

```
$ npm run build
```

### テストサーバー起動

```
npm run test
```


### gitignore

*.gitignore*
```
.DS_Store
npm-debug.log
node_modules
assets
tmp
```


### （メモ）Chromeでローカルファイルを開く設定

```
open /Applications/Google\ Chrome.app/ --args --disable-web-security --user-data-dir
```