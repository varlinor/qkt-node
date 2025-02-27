/**
 * 该方法是用于插件替换使用的空方法，请勿修改！
 * 会通过插件修改为如下格式：
 * export default function(id){
    console.warn('loaded by plugin:',id)
    switch(id){
      ${maps.join('\n')}
      default:
        return Promise.reject(new Error('Unknow variable dynamic import: '+id));
    }
  }
 * @param id
 * @returns
 */
export default function (id) {
  return id
}
