import fs from 'fs';
import path from 'path';

// 持久化存储基类
export abstract class PersistentStorage<T extends { id: string }> {
  protected items: T[] = [];
  protected filePath: string;
  protected dataDir: string;

  constructor(fileName: string) {
    // 确保数据目录存在
    this.dataDir = path.join(process.cwd(), 'data');
    this.filePath = path.join(this.dataDir, fileName);
    
    // 创建数据目录（如果不存在）
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    
    // 加载现有数据
    this.loadData();
  }

  // 从文件加载数据
  private loadData(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');
        this.items = JSON.parse(fileContent);
        console.log(`已加载 ${this.items.length} 条数据从 ${this.filePath}`);
      } else {
        this.items = [];
        console.log(`数据文件不存在，初始化为空数组: ${this.filePath}`);
      }
    } catch (error) {
      console.error(`加载数据文件失败 ${this.filePath}:`, error);
      this.items = [];
    }
  }

  // 保存数据到文件
  protected saveData(): void {
    try {
      const data = JSON.stringify(this.items, null, 2);
      fs.writeFileSync(this.filePath, data, 'utf-8');
      console.log(`已保存 ${this.items.length} 条数据到 ${this.filePath}`);
    } catch (error) {
      console.error(`保存数据文件失败 ${this.filePath}:`, error);
    }
  }

  getAll(): T[] {
    return [...this.items];
  }

  getById(id: string): T | undefined {
    return this.items.find(item => item.id === id);
  }

  add(item: Omit<T, 'id'>): T {
    const newItem = {
      ...item,
      id: this.generateId()
    } as T;
    
    this.items.push(newItem);
    this.saveData();
    return newItem;
  }

  update(id: string, updates: Partial<T>): T | null {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    this.items[index] = { ...this.items[index], ...updates };
    this.saveData();
    return this.items[index];
  }

  delete(id: string): T | null {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    const deletedItem = this.items.splice(index, 1)[0];
    this.saveData();
    return deletedItem;
  }

  exists(predicate: (item: T) => boolean): boolean {
    return this.items.some(predicate);
  }

  protected generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // 手动保存数据（用于批量操作）
  public forceSave(): void {
    this.saveData();
  }

  // 获取数据统计信息
  public getStats(): { count: number; filePath: string; lastModified?: Date } {
    const stats = fs.existsSync(this.filePath) ? fs.statSync(this.filePath) : null;
    return {
      count: this.items.length,
      filePath: this.filePath,
      lastModified: stats ? stats.mtime : undefined
    };
  }
}


