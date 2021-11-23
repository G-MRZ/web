	class Watcher {
		constructor(vm,exp,cb){
		    this.vm = vm; //vue实列
		    this.exp = exp; // name
		    this.cb = cb; //dom赋值函数
		    this.value = this.get();  // 将自己添加到订阅器的操作
		}
		get(){
			Dep.target = this;  // 缓存自己
        	let value = this.vm.data[this.exp]  // 强制执行监听器里的get函数
        	Dep.target = null;  // 释放自己
        	return value;
		}
		update(){
			let value = this.vm.data[this.exp];
        	let oldVal = this.value;
        	if (value !== oldVal) {
                this.value = value;
                this.cb.call(this.vm, value, oldVal);
			}
	}
}