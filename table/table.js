/**
 * 一个类似于antd中Table组件
 * 必须的参数：columns、dataSource；不必须的参数：width
 * 实现的功能：1.columns和dataSource相对应  2、width控制宽  3、columns中的render函数  4、columns中align、width属性
 */
window.Table = (function () {
  class Table {
    constructor(options) {
      this.columns = options.columns;
      this.dataSource = options.dataSource;
      this.width = options.width;
      this.init();
    }
    // 初始化
    init() {
      this.createElement();
    }
    // 创建元素
    create(type, cssText) {
      let element = document.createElement(type);
      element.style.cssText = cssText;
      return element;
    }
    // 创建节点
    createElement() {
      // table
      this.$TABLE = this.create(
        "table",
        `
                width: ${this.width};
            `
      );
      // thead
      this.$TABLE_HEAD = this.createHead();
      // tbody
      this.$TABLE_BODY = this.createBody();

      // 向table中添加thead
      this.$TABLE.appendChild(this.$TABLE_HEAD);

      // 向body中插入table
      document.body.appendChild(this.$TABLE);
      this.create("div");
    }
    // 创建thead
    createhead() {
      let { columns } = this;
      let THEAD_TH = null;
      // 创建thead
      this.$THEAD = this.create("thead", `background: #e3e3e3`);
      // 创建tr
      this.$THEAD_TR = this.create("tr");
      // 遍历创建th,并且向th中添加内容
      for (let i = 0; i < columns.length; i++) {
        THEAD_TH = this.create(
          "th",
          `
                                border: 1px solid #999;
                                width: ${columns[i]?.width};
                            `
        );
        THEAD_TH.innerHTML = columns[i].title;
        this.$THEAD_TR.appendChild(THEAD_TH);
      }
      // 向thead中添加tr节点
      this.$THEAD.appendChild(this.$THEAD_TR);
      // 返回thead
      return this.$THEAD;
    }
    // 判断key值问题
    getKey() {
      let { columns, dataSource } = this;
      for (let item = 0; item < columns.length; item++) {
        if (!item?.key) {
          throw new Warn("warning:需要一个key");
        }
      }
      for (let i = 0; i < columns.length; i++) {
        for (let j = 0; j < columns.length; j++) {
          if (i[key] === j[key]) {
            throw new Warn("warning: key值不能重复");
          }
        }
      }
    }

    // 创建tbody
    createBody() {
      let { dataSource, columns } = this;
      let TBODY_TR = null,
        TBODY_TD = null,
        TBODY = this.create("tbody");
      for (let i = 0; i < dataSource.length; i++) {
        TBODY_TR = this.create("tr");
        for (let j = 0; j < columns.length; j++) {
          TBODY_TD = this.create(
            "td",
            `
                        border: 1px solid #999;
                        text-align: ${columns[j]?.align};
                    `
          );
          if (columns[j]?.render && typeof columns[j]?.render === "function") {
            let render = columns[j]?.render(
              dataSource[i][columns[j]?.dataIndex],
              dataSource[i]
            );
            if (typeof render === "object") {
              TBODY_TD.appendChild(render);
            } else {
              TBODY_TD.innerHTML = render;
            }
          } else {
            TBODY_TD.innerHTML = dataSource[i][columns[j].dataIndex] || "";
          }
          TBODY_TR.appendChild(TBODY_TD);
          TBODY.appendChild(TBODY_TR);
        }
      }
      return TBODY;
    }
  }

  return function proxy(options = {}) {
    if (!Array.isArray(options?.columns)) {
      throw new Error("error：columns must be a array");
    } else {
      for (let i = 0; i < options?.columns.length; i++) {
        for (let j = i + 1; j < options?.columns.length; j++) {
          if (!options?.columns[i]?.key) {
            console.error("warning:Each item in columns should have a key");
            break;
          } else {
            if (options?.columns[i]?.key === options?.columns[j]?.key) {
              console.error(
                "warning:The key for each item in columns should be unique"
              );
              break;
            }
          }
        }
      }
    }
    if (!Array.isArray(options?.dataSource)) {
      throw new Error("错误：传入dataSource必须为数组");
    }
    if (options === null || typeof options !== "object") {
      throw new Error("错误：参数必须为对象");
    }
    options = Object.assign(
      {
        columns: [],
        dataSource: [],
        width: "80%",
      },
      options
    );
    return new Table(options);
  };
})();
