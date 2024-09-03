import simpleGit from 'simple-git';

/**
 * 删除指定标签，默认是删除snapshot
 * @param basePath
 * @param keyword
 * @param clearRemote
 * @param remoteName
 */
export async function deleteTags(basePath,keyword='snapshot',clearRemote=false,remoteName='origin'){
  const git=simpleGit(basePath)
  try {
    const tags=await git.tags()
    const targetTags= tags.all.filter(tag=>tag.includes(keyword))
    console.log('ready to clear tags:',targetTags);
    if( targetTags.length > 0 ){
      await git.tag(['-d',...targetTags])
      console.log('delete tags:[%s] successfully!',targetTags.join(','));

      if(clearRemote){
        const delRemoteTags=[]
        for (const tagName of targetTags) {
          delRemoteTags.push(`:refs/tags/${tagName}`)
        }
        await git.push(remoteName,...delRemoteTags)
        console.log(`delete remote tags:${delRemoteTags.join(',')}`);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
