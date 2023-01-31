// Task 1: code a person class

class person{
    constructor(name = "Tom", age = 20, energy = 100) {
        this.name = name;
        this.age = age;
        this.energy = energy;}
    
    sleep() {
        return this.energy += 10
    };
    doSomethingFun() {
        return this.energy -= 10
    };

}// task 2: code a worker class
class worker extends person{
    constructor(name, age, energy, xp = 0, hourlyWage = 10) {
        super(name, age, energy);
        this.xp = xp;
        this.hourlyWage = hourlyWage;
    }
    goToWork() {
        return this.xp += 10;
    }

}// Task 3: code an intern objects, run methods

function intern() {
    var intern = new worker('Bob', 21, 110, 0, 10)
    intern.goToWork();
    return intern;
}

// Task 4: code a manager
function manager() {
    var manager = new worker("Alice", 30, 120, 100, 30);
    manager.doSomethingFun();
    return manager;
}

console.log(intern());
console.log(manager());
