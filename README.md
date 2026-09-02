# ohos-diffutils — OpenHarmony riscv64 移植

> 本分支（`riscv64-ohos`）只存放 **OHOS riscv64 适配层**。原始代码保留在本 fork
> 默认分支（跟随上游，Sync fork 即可更新）。

## 结论：无源码补丁 —— 纯交叉编译适配（configure --host + musl 工具链）

| 项 | 值 |
|---|---|
| 版本 | 3.12 |
| 源码补丁 | 无（diff 全量核对：源码与上游 tarball 一致，差异均为构建生成物） |
| 工具链 | spacemit musl 交叉工具链（`riscv64-unknown-linux-musl-gcc/g++` / LLVM 版），编译服务器 snode7 |
| brew 包 | `hbrew/riscv/diffutils` |
| bottle | riscv-bin Release `bottles-v1.0`（经 tap `hbrew/riscv` 安装） |


## 构建（复现）

构建脚本集中在编译服务器 `~/WorkSpace/harmonybrew-port/`（`build-org-tools.sh`、
`build-tools.sh`、`build-git.sh`、`build-ruby.sh`、`build-zsh.sh`、
`build-python-bottle.sh` 等），核心套路：

```bash
export PATH=~/WorkSpace/spacemit-toolchain-linux-musl-x86_64-oh-20260630/bin:$PATH
./configure --host=riscv64-unknown-linux-musl --prefix=<stage-dir> 
make -j$(nproc) && make install
```

通用坑（musl/OHOS）：缺 `/tmp` 可写（设 `TMPDIR=/data/tmp`）、glibcism 头文件、
静态链接优先（设备无 glibc）。全量移植记录见
[harmonybrew-port/PORTING.md](https://github.com/shihuan1999/homebrew-riscv#porting-notes)
与 `workspace/harmonybrew-port/`。

## 版本更新

同步 fork → 上游新版本 tarball → 重跑构建脚本（无补丁可直接升级）→ 设备
`brew install` 冒烟 → 重发 bottle。
