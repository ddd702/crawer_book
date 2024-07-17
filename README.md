# crawler_book

一条命令行搜刮douban的图书信息

# Usage

## install

    npm install -g crawler_book

## 配置文件的方式获取
  
    getbook -c data.cjs

  以上只是一个例子：data.cjs表示一个配置文件，data.cjs中包含以下格式内容,并放到执行路径同一目录：

    ["安静","明朝那些事儿","老人与海"]
  
## 普通方式获取

  直接getbook后面带上书名就行，比如我想获取《安静》这本书的信息

    getbook 安静

# 搜刮图书信息

  数据来源于豆瓣
  在执行目录下会生成assets文件夹，里面有生产的信息，图书图片，和图书信息
