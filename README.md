# aliyun-cli

阿里云/腾讯云命令行工具，用于辅助自动化运维。


## 主要功能

* 命令行列出各种产品的到期时间。
    * 支持的产品
        * 阿里云
            * ECS 实例
            * RDS 实例
            * Domain 域名
            * SSL 证书
            * 账户余额
        * 腾讯云
            * 服务器
            * 轻量应用服务器
            * MySQL
* 支持生成 JSON 数据，可用于自定义分析。


## 一些说明

* 使用脚本前，可在阿里云/腾讯云编辑实例名称，以便识别不同的实例。
* 过期的 SSL 证书及时删除，避免干扰结果。
* 有些子账号创建的 AccessKey 没有某些模块的读取权限，需要在配置文件里把相关的模块去掉。


## 安装/使用

安装 `@yunser/aliyun-cli`。

```
npm i -g @yunser/aliyun-cli
aliyun -v
```

生成配置文件。

```
aliyun init
```

编辑 accessKeys.json，参考里面的示例，然后

```
aliyun run
```

输出：

```
======== ECS ========
╔════════════════════════════════╤═════════════════════╗
║ Name                           │ Expire Time         ║
╟────────────────────────────────┼─────────────────────╢
║ yunser-dev                     │ 2022-11-05 00:00:00 ║
╟────────────────────────────────┼─────────────────────╢
║ yunser-main                    │ 2022-11-11 00:00:00 ║
╚════════════════════════════════╧═════════════════════╝

======== RDS ========
╔══════════════╤═════════════════════╗
║ Name         │ Expire Time         ║
╟──────────────┼─────────────────────╢
║ yunser-prod  │ 2023-09-28 00:00:00 ║
╚══════════════╧═════════════════════╝

======== Domain ========
╔══════════════════╤═════════════════════╗
║ Name             │ Expire Time         ║
╟──────────────────┼─────────────────────╢
║ yunser.com       │ 2023-06-30 10:19:21 ║
╚══════════════════╧═════════════════════╝

======== Billing ========
╔══════════════╤══════════════════╗
║ Name         │ Available Amount ║
╟──────────────┼──────────────────╢
║ yunser-first │ 10.17            ║
╚══════════════╧══════════════════╝

======== Cert ========
╔═════════════════════════════╤═════════════════════╗
║ Domain                      │ Expire Time         ║
╟─────────────────────────────┼─────────────────────╢
║ test.yunser.com             │ 2022-11-29 23:59:59 ║
╚═════════════════════════════╧═════════════════════╝

ECS results saved, path: {xxx}/aliyun-ecs.json
RDS results saved, path: {xxx}/aliyun-rds.json
Domain results saved, path: {xxx}/aliyun-domain.json
...
```


## 文件目录

* `~/.yunser/aliyun-cli/accessKeys.json`：阿里云/腾讯云秘钥配置文件。
* `~/.yunser/aliyun-cli/data`：生成的 JSON 数据文件存放目录。


## 配置文件介绍

阿里云配置：

```json
{
    "version": "1.0.0", // 命令行生成的，保存一样就行
    "accessKeys": [
        {
            "type": "aliyun", // aliyun or tencent
            "name": "NAME", // 名称，仅用于区分 Access Key，任意名称即可
            "accessKeyId": "ACCESS_KEY_ID", // 阿里云后台生成
            "accessKeySecret": "ACCESS_KEY_SECRET", // 阿里云后台生成
            "ecs": { // 没有 ECS 模块的权限时去掉。
                "regions": [
                    "cn-beijing" // ECS 所属地区，支持多个。暂不支持自动识别，故需手动配置。去阿里云后台查看
                ]
            },
            "rds": { // 没有 RDS 模块的权限时去掉。
                "regions": [
                    "cn-beijing" // RDS 所属地区
                ]
            },
            "domain": {}, // {} 表示需要获取域名信息。没有域名模块的权限时去掉。
            "billing": {}, // 开启账户余额模块。没有账单模块的权限时去掉。
            "cert": {} // 开启 SSL 证书模块。没有证书模块的权限时去掉。
        }
    ]
}
```

腾讯云配置：

```json
{
    "version": "1.0.0",
    "accessKeys": [
        {
            "type": "tencent", // aliyun or tencent
            "name": "NAME", // 名称，仅用于区分 Access Key，任意名称即可
            "secretId": "SECRET_ID", // 腾讯云后台生成
            "secretKey": "SECRET_KEY", // 腾讯云后台生成
            "server": { // 没有云服务器模块的权限时去掉。
                "regions": [
                    "ap-guangzhou" // 云服务器所在的地区
                ]
            },
            "mysql": { // 没有 MySQL 模块的权限时去掉。
                "regions": [
                    "ap-guangzhou"
                ]
            },
            "lighthouse": { // 没有轻量服务器模块的权限时去掉。
                "regions": [
                    "ap-guangzhou"
                ]
            }
        }
    ]
}
```


## 其他

几个阿里云地域 ID

| 地区 | 地域 ID       |
|----|-------------|
| 杭州 | cn-hangzhou |
| 上海 | cn-shanghai |
| 北京 | cn-beijing  |
| 青岛 | cn-qingdao  |
| 深圳 | cn-shenzhen  |

基本很多都是拼音全拼（不保证一定是这样）


## 安全性说明

* 数据不上传至除了阿里云/腾讯云外的第三方服务器。
* 私钥储存在计算机上，请勿在不受信任的计算机上使用此软件。
