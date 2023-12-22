/*
 * @Author: wurangkun
 * @Date: 2023-12-22 15:12:36
 * @LastEditTime: 2023-12-22 17:21:23
 * @LastEditors: wurangkun
 * @FilePath: \Julia-na-web\src\index.ts
 * @Description: 
 */

/** 生产uuid */
export function uuid() {
  const s: string[] = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++)
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)

  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  // @ts-expect-error
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'
  return s.join('')
}

/** 兼容ios时间 将 2022-11-11 转换为 2022/11/11 */
export function getIOSDate(date: string) {
  return new Date(date.replace(/-/g, "/"))
}

/**
 * 验证手机号
 */
export function validPhone(phoneStr: string): boolean {
  const mobile = /^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])+\d{8})$/
  // const mobile = /^1[3-9]\d{9}$/
  return mobile.test(phoneStr)
}

/** 格式化隐私号码 13621324655 -> 136****4655 */
export function formatPrivateMobile(mobile: string | number) {
  if (!mobile) return ''
  const a = `${mobile}`
  if (validPhone(a)) return `${a.slice(0, 3)}****${a.slice(-4)}`
  return a
}


/**
 * 计算两个经纬度之间的距离
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const radius = 6371 * 1000 // 地球半径（单位：米）

  // 将经纬度转换为弧度
  const latRad1 = toRadians(lat1)
  const lonRad1 = toRadians(lon1)
  const latRad2 = toRadians(lat2)
  const lonRad2 = toRadians(lon2)

  // 使用Haversine公式计算距离
  const dlon = lonRad2 - lonRad1
  const dlat = latRad2 - latRad1
  const a
    = Math.sin(dlat / 2) ** 2
    + Math.cos(latRad1) * Math.cos(latRad2) * Math.sin(dlon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = radius * c

  return distance
}

function toRadians(degrees: number) {
  return degrees * (Math.PI / 180)
}


export function deepCopyMap(originalMap: Map<any, any>) {
  const newMap = new Map()

  originalMap.forEach((value, key) => {
    // 如果 value 是一个对象或数组，使用递归调用进行深拷贝
    if (typeof value === 'object' && value !== null) {
      newMap.set(key, deepClone(value))
    }
    else { // 否则直接复制值
      newMap.set(key, value)
    }
  })

  return newMap
}

function deepClone<T>(obj: T | null): T | null {
  if (obj === null) return null;
  if (typeof obj !== 'object') return obj;

  let copy: any = obj instanceof Date ? new Date(obj) : obj instanceof RegExp ? new RegExp(obj) : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepClone(obj[key] as T | null);
    }
  }

  return copy as T | null;
}


/** 验证两个map的key是否相等 */
export function areKeysEqual(map1: Map<any, any>, map2: Map<any, any>) {
  const keys1 = Array.from(map1.keys())
  const keys2 = Array.from(map2.keys())

  // 判断键集合是否相等
  if (keys1.length !== keys2.length)
    return false

  for (let i = 0; i < keys1.length; i++) {
    if (!keys2.includes(keys1[i]))
      return false
  }

  return true
}

/** 每个键对应的值是否相等 */
export function areValuesEqual(map1: Map<any, any>, map2: Map<any, any>) {
  const keys1 = Array.from(map1.keys())

  // 检查每个键对应的值是否相等
  for (let i = 0; i < keys1.length; i++) {
    const key = keys1[i]
    if (!map2.has(key) || !deepEqual(map1.get(key), map2.get(key)))
      return false
  }

  return true
}

function deepEqual(value1: any, value2: any) {
  if (value1 === value2)
    return true

  if (typeof value1 !== 'object' || typeof value2 !== 'object' || value1 === null || value2 === null)
    return false

  const props1 = Object.keys(value1)
  const props2 = Object.keys(value2)

  if (props1.length !== props2.length)
    return false

  for (let i = 0; i < props1.length; i++) {
    const prop = props1[i]

    // eslint-disable-next-line no-prototype-builtins
    if (!value2.hasOwnProperty(prop) || !deepEqual(value1[prop], value2[prop]))
      return false
  }

  return true
}
