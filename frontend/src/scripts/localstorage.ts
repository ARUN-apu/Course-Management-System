export function getData<T>(key: string): T[]{
    const data = localStorage.getItem(key);
    
    if(!data){
        return [];
    }
    
    return JSON.parse(data);
}

export function saveData<T>(key:string, data: T[]): void{
    localStorage.setItem(key, JSON.stringify(data));
}

export function generateId(): number{
    return Date.now();
}

export function addItem<T extends {id: number}>(key: string, item: T): void{
    const items = getData<T>(key);
    items.push(item);
    saveData(key, items);
}

export function updateItem<T extends {id: number}>(key: string, updatedItem: T): void{
    const items = getData<T>(key);
    const updated = items.map(item => item.id === updatedItem.id ? updatedItem : item);
    saveData(key, updated);
}

export function deleteItem<T extends {id: number}>(key: string, id: number):  void{
    const items = getData<T>(key);
    const filtered = items.filter(item => item.id !== id);
    saveData(key, filtered);
}