/**
 * 解析入口文件,并且生成依赖关系图
 */
const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')    // 解析 ES6 -> ES5

const moduleAnalyzer = filename => {
  // 模块内容
  const content = fs.readFileSync(filename, 'utf-8')
  // 抽象语法树
  const ast = parser.parse(content, {
    sourceType: 'module'
  })
  // 模块依赖关系
  const dependencies = {}
  traverse(ast, {
    ImportDeclaration ({ node }) {
      let filepath = path.dirname(filename)
      let newFile = './' + path.join(filepath, node.source.value)
      dependencies[node.source.value] = newFile
    }
  })
  // 转换为浏览器可识别的js ES5
  // 转换成可在浏览器上运行的代码
  let { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"]
  })
  return {
    filename,
    dependencies,
    code
  }
}

// 分析依赖图谱 存取所有模块的依赖信息
// 解析所有模块的依赖关系并 transforming 转换代码为浏览器可执行的code
const makeDependencies = (entry) => {
  const entryModule = moduleAnalyzer(entry)
  const dependenciesArray = [ entryModule ]
  for (let i = 0; i < dependenciesArray.length; i++) {
    let dep = dependenciesArray[i].dependencies
    if (dep) {
      for (item in dep) {
        dependenciesArray.push(moduleAnalyzer(dep[item]))
      }
    }
  }
  const graph = {}
  dependenciesArray.forEach(item => {
    graph[item.filename] = {
      dependencies: item.dependencies,
      code: item.code
    }
  })
  return graph;
}

let graphInfo = makeDependencies('./src/index.js')
console.log(graphInfo);