import { IDynamicPropertyTarget } from "../interfacaces/IDynamicPropertyTarget";
import { split_by_bytes as splitByBytes } from "../tools";
import { DynamicData } from "./DynamicData";

const MAX_CHUNK_LENGTH = 32767;

//有待测试
//切勿大量进行读写，否则将会造成卡顿
export class LongDynamicJson<T> {
  private id: string;
  private target: IDynamicPropertyTarget;
  private length: DynamicData<number>;
  private data: DynamicData<string>[];
  constructor(target: IDynamicPropertyTarget, id: string, value: T = <T>undefined) {
    this.id = id;
    this.target = target;
    this.length = new DynamicData<number>(target, `${id}_length`, 0);
    this.data = new Array();

    const len = this.length.get();
    if (len <= 0) this.set(value);
    else {
      for (let index = 0; index < len; index++) {
        this.data[index] = new DynamicData<string>(target, this.get_idx_id(index));
      }
    }
  }

  get_idx_id(idx: number) {
    return `${this.id}_${idx}`;
  }

  public set_raw(value: string) {
    if (value == undefined) return;

    let length_counter: number = 0;
    for (let ele of splitByBytes(value, MAX_CHUNK_LENGTH)) {
      this.data[length_counter] = new DynamicData<string>(this.target, this.get_idx_id(length_counter));
      this.data[length_counter].set(ele);
      length_counter++;
    }

    const previous_length = this.length.get();
    const current_length = length_counter;
    //清理多余部分
    if (previous_length > current_length) {
      this.data.slice(current_length, previous_length).forEach((ele) => {
        ele.free();
      });
      this.data = this.data.slice(0, current_length);
    }
    this.length.set(current_length);
  }

  public set(value: T) {
    this.set_raw(JSON.stringify(value));
  }

  public get_raw(): string {
    return this.data
      .map((ele) => {
        return ele.get();
      })
      .join("");
  }

  public get(): T {
    return JSON.parse(this.get_raw());
  }

  //获取的是分块个数而非字符长度
  public get_count_of_chunks() {
    return this.length.get();
  }

  public free(): void {
    this.data.forEach((e) => {
      e.free();
    });
    this.data = [];
  }
}
