"use strict";(self.webpackChunkoura_node_editor=self.webpackChunkoura_node_editor||[]).push([[66],{1367:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>he,contentTitle:()=>fe,default:()=>ye,frontMatter:()=>de,metadata:()=>pe,toc:()=>ge});var r=t(2540),o=t(8453),i=t(3696),a=t(150);function c(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function u(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?u(Object(t),!0).forEach((function(n){c(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):u(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}function d(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}function f(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function p(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function h(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?p(Object(t),!0).forEach((function(n){f(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):p(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function g(e){return function n(){for(var t=this,r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return o.length>=e.length?e.apply(this,o):function(){for(var e=arguments.length,r=new Array(e),i=0;i<e;i++)r[i]=arguments[i];return n.apply(t,[].concat(o,r))}}}function m(e){return{}.toString.call(e).includes("Object")}function y(e){return"function"==typeof e}var v=g((function(e,n){throw new Error(e[n]||e.default)}))({initialIsRequired:"initial state is required",initialType:"initial state should be an object",initialContent:"initial state shouldn't be an empty object",handlerType:"handler should be an object or a function",handlersType:"all handlers should be a functions",selectorType:"selector should be a function",changeType:"provided value of changes should be an object",changeField:'it seams you want to change a field in the state which is not specified in the "initial" state',default:"an unknown error accured in `state-local` package"}),b={changes:function(e,n){return m(n)||v("changeType"),Object.keys(n).some((function(n){return t=e,r=n,!Object.prototype.hasOwnProperty.call(t,r);var t,r}))&&v("changeField"),n},selector:function(e){y(e)||v("selectorType")},handler:function(e){y(e)||m(e)||v("handlerType"),m(e)&&Object.values(e).some((function(e){return!y(e)}))&&v("handlersType")},initial:function(e){var n;e||v("initialIsRequired"),m(e)||v("initialType"),n=e,Object.keys(n).length||v("initialContent")}};function j(e,n){return y(n)?n(e.current):n}function w(e,n){return e.current=h(h({},e.current),n),n}function x(e,n,t){return y(n)?n(e.current):Object.keys(t).forEach((function(t){var r;return null===(r=n[t])||void 0===r?void 0:r.call(n,e.current[t])})),t}const O={create:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};b.initial(e),b.handler(n);var t={current:e},r=g(x)(t,n),o=g(w)(t),i=g(b.changes)(e),a=g(j)(t);return[function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(e){return e};return b.selector(e),e(t.current)},function(e){!function(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return function(e){return n.reduceRight((function(e,n){return n(e)}),e)}}(r,o,i,a)(e)}]}};const M={paths:{vs:"https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs"}};const k=function(e){return{}.toString.call(e).includes("Object")};var E={configIsRequired:"the configuration object is required",configType:"the configuration object should be an object",default:"an unknown error accured in `@monaco-editor/loader` package",deprecation:"Deprecation warning!\n    You are using deprecated way of configuration.\n\n    Instead of using\n      monaco.config({ urls: { monacoBase: '...' } })\n    use\n      monaco.config({ paths: { vs: '...' } })\n\n    For more please check the link https://github.com/suren-atoyan/monaco-loader#config\n  "},P=function(e){return function n(){for(var t=this,r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];return o.length>=e.length?e.apply(this,o):function(){for(var e=arguments.length,r=new Array(e),i=0;i<e;i++)r[i]=arguments[i];return n.apply(t,[].concat(o,r))}}}((function(e,n){throw new Error(e[n]||e.default)}))(E),T={config:function(e){return e||P("configIsRequired"),k(e)||P("configType"),e.urls?(console.warn(E.deprecation),{paths:{vs:e.urls.monacoBase}}):e}};const C=T;const I=function(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return function(e){return n.reduceRight((function(e,n){return n(e)}),e)}};const S=function e(n,t){return Object.keys(t).forEach((function(r){t[r]instanceof Object&&n[r]&&Object.assign(t[r],e(n[r],t[r]))})),s(s({},n),t)};var A={type:"cancelation",msg:"operation is manually canceled"};const R=function(e){var n=!1,t=new Promise((function(t,r){e.then((function(e){return n?r(A):t(e)})),e.catch(r)}));return t.cancel=function(){return n=!0},t};var N,L,_=O.create({config:M,isInitialized:!1,resolve:null,reject:null,monaco:null}),D=(L=2,function(e){if(Array.isArray(e))return e}(N=_)||function(e,n){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var t=[],r=!0,o=!1,i=void 0;try{for(var a,c=e[Symbol.iterator]();!(r=(a=c.next()).done)&&(t.push(a.value),!n||t.length!==n);r=!0);}catch(u){o=!0,i=u}finally{try{r||null==c.return||c.return()}finally{if(o)throw i}}return t}}(N,L)||function(e,n){if(e){if("string"==typeof e)return d(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?d(e,n):void 0}}(N,L)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),V=D[0],B=D[1];function q(e){return document.body.appendChild(e)}function z(e){var n,t,r=V((function(e){return{config:e.config,reject:e.reject}})),o=(n="".concat(r.config.paths.vs,"/loader.js"),t=document.createElement("script"),n&&(t.src=n),t);return o.onload=function(){return e()},o.onerror=r.reject,o}function F(){var e=V((function(e){return{config:e.config,resolve:e.resolve,reject:e.reject}})),n=window.require;n.config(e.config),n(["vs/editor/editor.main"],(function(n){U(n),e.resolve(n)}),(function(n){e.reject(n)}))}function U(e){V().monaco||B({monaco:e})}var Z=new Promise((function(e,n){return B({resolve:e,reject:n})})),H={config:function(e){var n=C.config(e),t=n.monaco,r=l(n,["monaco"]);B((function(e){return{config:S(e.config,r),monaco:t}}))},init:function(){var e=V((function(e){return{monaco:e.monaco,isInitialized:e.isInitialized,resolve:e.resolve}}));if(!e.isInitialized){if(B({isInitialized:!0}),e.monaco)return e.resolve(e.monaco),R(Z);if(window.monaco&&window.monaco.editor)return U(window.monaco),e.resolve(window.monaco),R(Z);I(q,z)(F)}return R(Z)},__getMonacoInstance:function(){return V((function(e){return e.monaco}))}};const Y=H;var G={wrapper:{display:"flex",position:"relative",textAlign:"initial"},fullWidth:{width:"100%"},hide:{display:"none"}},J={container:{display:"flex",height:"100%",width:"100%",justifyContent:"center",alignItems:"center"}};var W=function({children:e}){return i.createElement("div",{style:J.container},e)};var Q=function({width:e,height:n,isEditorReady:t,loading:r,_ref:o,className:a,wrapperProps:c}){return i.createElement("section",{style:{...G.wrapper,width:e,height:n},...c},!t&&i.createElement(W,null,r),i.createElement("div",{ref:o,style:{...G.fullWidth,...!t&&G.hide},className:a}))},X=(0,i.memo)(Q);var $=function(e){(0,i.useEffect)(e,[])};var K=function(e,n,t=!0){let r=(0,i.useRef)(!0);(0,i.useEffect)(r.current||!t?()=>{r.current=!1}:e,n)};function ee(){}function ne(e,n,t,r){return function(e,n){return e.editor.getModel(te(e,n))}(e,r)||function(e,n,t,r){return e.editor.createModel(n,t,r?te(e,r):void 0)}(e,n,t,r)}function te(e,n){return e.Uri.parse(n)}var re=function({original:e,modified:n,language:t,originalLanguage:r,modifiedLanguage:o,originalModelPath:a,modifiedModelPath:c,keepCurrentOriginalModel:u=!1,keepCurrentModifiedModel:s=!1,theme:l="light",loading:d="Loading...",options:f={},height:p="100%",width:h="100%",className:g,wrapperProps:m={},beforeMount:y=ee,onMount:v=ee}){let[b,j]=(0,i.useState)(!1),[w,x]=(0,i.useState)(!0),O=(0,i.useRef)(null),M=(0,i.useRef)(null),k=(0,i.useRef)(null),E=(0,i.useRef)(v),P=(0,i.useRef)(y),T=(0,i.useRef)(!1);$((()=>{let e=Y.init();return e.then((e=>(M.current=e)&&x(!1))).catch((e=>"cancelation"!==e?.type&&console.error("Monaco initialization: error:",e))),()=>O.current?function(){let e=O.current?.getModel();u||e?.original?.dispose(),s||e?.modified?.dispose(),O.current?.dispose()}():e.cancel()})),K((()=>{if(O.current&&M.current){let n=O.current.getOriginalEditor(),o=ne(M.current,e||"",r||t||"text",a||"");o!==n.getModel()&&n.setModel(o)}}),[a],b),K((()=>{if(O.current&&M.current){let e=O.current.getModifiedEditor(),r=ne(M.current,n||"",o||t||"text",c||"");r!==e.getModel()&&e.setModel(r)}}),[c],b),K((()=>{let e=O.current.getModifiedEditor();e.getOption(M.current.editor.EditorOption.readOnly)?e.setValue(n||""):n!==e.getValue()&&(e.executeEdits("",[{range:e.getModel().getFullModelRange(),text:n||"",forceMoveMarkers:!0}]),e.pushUndoStop())}),[n],b),K((()=>{O.current?.getModel()?.original.setValue(e||"")}),[e],b),K((()=>{let{original:e,modified:n}=O.current.getModel();M.current.editor.setModelLanguage(e,r||t||"text"),M.current.editor.setModelLanguage(n,o||t||"text")}),[t,r,o],b),K((()=>{M.current?.editor.setTheme(l)}),[l],b),K((()=>{O.current?.updateOptions(f)}),[f],b);let C=(0,i.useCallback)((()=>{if(!M.current)return;P.current(M.current);let i=ne(M.current,e||"",r||t||"text",a||""),u=ne(M.current,n||"",o||t||"text",c||"");O.current?.setModel({original:i,modified:u})}),[t,n,o,e,r,a,c]),I=(0,i.useCallback)((()=>{!T.current&&k.current&&(O.current=M.current.editor.createDiffEditor(k.current,{automaticLayout:!0,...f}),C(),M.current?.editor.setTheme(l),j(!0),T.current=!0)}),[f,l,C]);return(0,i.useEffect)((()=>{b&&E.current(O.current,M.current)}),[b]),(0,i.useEffect)((()=>{!w&&!b&&I()}),[w,b,I]),i.createElement(X,{width:h,height:p,isEditorReady:b,loading:d,_ref:k,className:g,wrapperProps:m})};(0,i.memo)(re);var oe=function(e){let n=(0,i.useRef)();return(0,i.useEffect)((()=>{n.current=e}),[e]),n.current},ie=new Map;var ae=function({defaultValue:e,defaultLanguage:n,defaultPath:t,value:r,language:o,path:a,theme:c="light",line:u,loading:s="Loading...",options:l={},overrideServices:d={},saveViewState:f=!0,keepCurrentModel:p=!1,width:h="100%",height:g="100%",className:m,wrapperProps:y={},beforeMount:v=ee,onMount:b=ee,onChange:j,onValidate:w=ee}){let[x,O]=(0,i.useState)(!1),[M,k]=(0,i.useState)(!0),E=(0,i.useRef)(null),P=(0,i.useRef)(null),T=(0,i.useRef)(null),C=(0,i.useRef)(b),I=(0,i.useRef)(v),S=(0,i.useRef)(),A=(0,i.useRef)(r),R=oe(a),N=(0,i.useRef)(!1),L=(0,i.useRef)(!1);$((()=>{let e=Y.init();return e.then((e=>(E.current=e)&&k(!1))).catch((e=>"cancelation"!==e?.type&&console.error("Monaco initialization: error:",e))),()=>P.current?(S.current?.dispose(),p?f&&ie.set(a,P.current.saveViewState()):P.current.getModel()?.dispose(),void P.current.dispose()):e.cancel()})),K((()=>{let i=ne(E.current,e||r||"",n||o||"",a||t||"");i!==P.current?.getModel()&&(f&&ie.set(R,P.current?.saveViewState()),P.current?.setModel(i),f&&P.current?.restoreViewState(ie.get(a)))}),[a],x),K((()=>{P.current?.updateOptions(l)}),[l],x),K((()=>{!P.current||void 0===r||(P.current.getOption(E.current.editor.EditorOption.readOnly)?P.current.setValue(r):r!==P.current.getValue()&&(L.current=!0,P.current.executeEdits("",[{range:P.current.getModel().getFullModelRange(),text:r,forceMoveMarkers:!0}]),P.current.pushUndoStop(),L.current=!1))}),[r],x),K((()=>{let e=P.current?.getModel();e&&o&&E.current?.editor.setModelLanguage(e,o)}),[o],x),K((()=>{void 0!==u&&P.current?.revealLine(u)}),[u],x),K((()=>{E.current?.editor.setTheme(c)}),[c],x);let _=(0,i.useCallback)((()=>{if(T.current&&E.current&&!N.current){I.current(E.current);let i=a||t,s=ne(E.current,r||e||"",n||o||"",i||"");P.current=E.current?.editor.create(T.current,{model:s,automaticLayout:!0,...l},d),f&&P.current.restoreViewState(ie.get(i)),E.current.editor.setTheme(c),void 0!==u&&P.current.revealLine(u),O(!0),N.current=!0}}),[e,n,t,r,o,a,l,d,f,c,u]);return(0,i.useEffect)((()=>{x&&C.current(P.current,E.current)}),[x]),(0,i.useEffect)((()=>{!M&&!x&&_()}),[M,x,_]),A.current=r,(0,i.useEffect)((()=>{x&&j&&(S.current?.dispose(),S.current=P.current?.onDidChangeModelContent((e=>{L.current||j(P.current.getValue(),e)})))}),[x,j]),(0,i.useEffect)((()=>{if(x){let e=E.current.editor.onDidChangeMarkers((e=>{let n=P.current.getModel()?.uri;if(n&&e.find((e=>e.path===n.path))){let e=E.current.editor.getModelMarkers({resource:n});w?.(e)}}));return()=>{e?.dispose()}}return()=>{}}),[x,w]),i.createElement(X,{width:h,height:g,isEditorReady:x,loading:s,_ref:T,className:m,wrapperProps:y})},ce=(0,i.memo)(ae),ue=t(5293);const se={name:"rectangle",position:{x:50,y:50},width:200,connectors:{0:{name:"draw",pinLayout:2,contentType:"none",data:{}},1:{name:"x",pinLayout:1,contentType:"number",data:{value:20,disabled:!0}},2:{name:"y",pinLayout:1,contentType:"number",data:{value:20,disabled:!0}},3:{name:"width",pinLayout:1,contentType:"number",data:{value:100,disabled:!1}},4:{name:"height",pinLayout:1,contentType:"number",data:{value:100,disabled:!1}},5:{name:"color",pinLayout:1,contentType:"none",data:{value:"black"},leftPinColor:"orange"},6:{name:"type",pinLayout:0,contentType:"select",data:{values:["fill","stroke","clear"],selected_index:0}},7:{name:"line width",pinLayout:1,contentType:"number",data:{value:1,disabled:!1}}},category:"canvas"};function le(){const{isDarkTheme:e}=(0,ue.G)(),{nodes:n,links:t,panZoomInfo:o,setNodes:c,setLinks:u,setPanZoomInfo:s,onConnectorUpdate:l}=(0,a.ZC)();(0,i.useEffect)((()=>{c([se]),u({})}),[u,c]);const[d,f]=(0,i.useState)(JSON.stringify(se,null,4)),p=(0,i.useCallback)((()=>{try{const e=JSON.parse(d);c([e])}catch(e){console.error(e)}}),[d,c]);return(0,r.jsxs)("div",{style:{display:"flex",height:"521px"},children:[(0,r.jsxs)("div",{style:{display:"flex",flexDirection:"column",width:"50%"},children:[(0,r.jsx)(ce,{theme:e?"vs-dark":"vs",height:"500px",defaultLanguage:"json",defaultValue:d,onChange:e=>f(e)}),(0,r.jsx)("button",{onClick:p,children:"generate"})]}),(0,r.jsx)("div",{style:{width:"50%",height:"521.5px"},children:(0,r.jsx)(a.mw,{panZoomInfo:o,nodes:n,links:t,selectedItems:[],onPanZoomInfo:s,onSelectedItems:()=>{},onConnectorUpdate:l})})]})}const de={sidebar_position:1},fe="Introduction",pe={id:"introduction",title:"Introduction",description:"Oura-node-editor is a React component library allowing you the creation of node based editors. Node based editors are used to create and edit node graph architecture.",source:"@site/docs/introduction.mdx",sourceDirName:".",slug:"/introduction",permalink:"/oura-node-editor/docs/introduction",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",next:{title:"Quickstart",permalink:"/oura-node-editor/docs/quickstart"}},he={},ge=[{value:"Another node editor ?",id:"another-node-editor-",level:2},{value:"Experimental project",id:"experimental-project",level:2},{value:"Anatomy of a node",id:"anatomy-of-a-node",level:2},{value:"Anatomy of a edge",id:"anatomy-of-a-edge",level:2}];function me(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"introduction",children:"Introduction"}),"\n",(0,r.jsxs)(n.p,{children:["Oura-node-editor is a React component library allowing you the creation of node based editors. Node based editors are used to create and edit ",(0,r.jsx)(n.a,{href:"https://en.wikipedia.org/wiki/Node_graph_architecture",children:"node graph architecture"}),".\nThis architecture relies on atomic functional units called ",(0,r.jsx)(n.strong,{children:"nodes"}),". Each node can have a state, inputs and outputs. Those inputs and outputs can be connected together using ",(0,r.jsx)(n.strong,{children:"links"}),". By doing so, it is possible to model business logic, 3d materials and shaders, programming logic, among many other things."]}),"\n",(0,r.jsx)(n.p,{children:"Today, node based editors are used in various software to achieve many tasks:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Creating shaders and materials in 3d software"}),"\n",(0,r.jsx)(n.li,{children:"Creating game logic in some game engines"}),"\n",(0,r.jsx)(n.li,{children:"Editing and visualizing data and mathematical operations"}),"\n",(0,r.jsx)(n.li,{children:"Creating a variety of domain specific langages"}),"\n",(0,r.jsx)(n.li,{children:"Creating cool and strange creative coding stuff!"}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"another-node-editor-",children:"Another node editor ?"}),"\n",(0,r.jsx)(n.p,{children:"Many react UI libs allows to charts and somehow node editors.\nOura-node-editor is focus on those objectives:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Be easy to setup and use"}),"\n",(0,r.jsx)(n.li,{children:"Be highly modulable allowing users to create custom node and custom node connectors (more on that later)"}),"\n",(0,r.jsx)(n.li,{children:"Be highly efficient and allowing to render hundreds of nodes"}),"\n",(0,r.jsx)(n.li,{children:"Have many themes to be fit every projects"}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"experimental-project",children:"Experimental project"}),"\n",(0,r.jsx)(n.p,{children:"This project is an experimental one. As a result, many design choices can be updated\nThe documentation is also far from complete as of today !"}),"\n",(0,r.jsx)(n.h2,{id:"anatomy-of-a-node",children:"Anatomy of a node"}),"\n",(0,r.jsx)(n.p,{children:"A node in oura-node-editor have several properties:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:'export interface NodeModel {\n    name: string; // A name: "rectangle"\n    position: XYPosition; // A position: {x: 10, y: 20}\n    width: number; // A width in pixel: 200\n    connectors: ConnectorCollection; // Zero, one or many node connectors, see bellow\n    category?: string; // An optional category ("math", "canvas", "3d", ... nodes)\n    description?: string; // An optional description: "draw a circle"\n}\n'})}),"\n",(0,r.jsx)(n.p,{children:"Node connector create the body and behaviour of our node, each node connector have those properties:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:'export interface ConnectorModel {\n    name: string; // A name: "width"\n    /*\n    A "pin layout" indicates if the node connector have an input, output, both or none \n    (NO_PINS=0, LEFT_PIN=1, RIGHT_PIN=2, BOTH_PINS=3)\n    */\n    pinLayout: PinLayout;\n    /*\n    A content type to indicate the nature of the node connector. \n    Some are already provided by oura-node-editor ("number", "string", "text_area", "select", "check_box", "button", "range"). \n    You can also create yours (canvas, images, 3d views, ...)\n    */\n    contentType: string;\n    /*\n    Data to store content type (a string, a number, a color, ...) or other pieces of information\n    */\n    data: any;\n\n    leftPinColor?: string; //An optional left pin color ("#ff0011")\n    rightPinColor?: string; //An optional right pin color ("red")\n}\n'})}),"\n",(0,r.jsx)(n.p,{children:"Bellow you have an editable json representing a single node and the result on the node editor. Feel free to try creating your first node and understand the data model!"}),"\n",(0,r.jsx)(le,{}),"\n",(0,r.jsx)(n.h2,{id:"anatomy-of-a-edge",children:"Anatomy of a edge"}),"\n",(0,r.jsx)(n.p,{children:"An edge objective is to link a left pin of a connector of a node A to a right pin of a connector of node B."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:"export interface LinkModel {\n    leftNodeId: string;\n    leftNodeConnectorId: string;\n    rightNodeId: string;\n    rightNodeConnectorId: string;\n}\n"})})]})}function ye(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(me,{...e})}):me(e)}}}]);