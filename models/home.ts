import rootDir from '../Utils/path';
import fs from 'fs';
import path from 'path';

export interface IRegister {
  email: string;
  topic: string;
  message: string;
}

export default class Register implements IRegister {
  email: string;
  topic: string;
  message: string;

  constructor(email: string, topic: string, message: string) {
    this.email = email;
    this.topic = topic;
    this.message = message;
  }

  save(): void {
    Register.fetchAll((file: IRegister[]) => {
      file.push({ email: this.email, topic: this.topic, message: this.message });
      const homeDataPath = path.join(rootDir, 'data', 'home.json');
      fs.writeFile(homeDataPath, JSON.stringify(file), (error) => {
        if (error) {
          console.log("File writing error!", error);
        }
      });
    });
  }

  static fetchAll(callback: (data: IRegister[]) => void): void {
    const homeDataPath = path.join(rootDir, 'data', 'home.json');
    fs.readFile(homeDataPath, 'utf8', (err, data) => {
      if (!err && data) {
        try {
          callback(JSON.parse(data) as IRegister[]);
        } catch (e) {
          callback([]);
        }
      } else {
        callback([]);
      }
    });
  }
}
