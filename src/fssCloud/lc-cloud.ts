import leanCloud from './leancloud-storage-min/storage'
import { AccessControl } from './interface'

// 获取权限控制
function getAcl(acl : AccessControl) : leanCloud.ACL {
  let objAcl = new leanCloud.ACL()
  // 读控制
  if (acl.read) {
    if (acl.read === 'self') {
      objAcl.setReadAccess(leanCloud.User.current(), true)
    } else if (acl.read === 'public') {
      objAcl.setPublicReadAccess(true)
    } else if (acl.read === 'none') {
      objAcl.setPublicReadAccess(false)
    } else if (acl.read instanceof Array) {
      acl.read.forEach(item => {
        if(item instanceof leanCloud.Role) {
          objAcl.setRoleReadAccess(item, true)
        } else {
          objAcl.setReadAccess(item, true)
        }
      })
    } else if(acl.read instanceof leanCloud.Role) {
      objAcl.setRoleReadAccess(acl.read, true)
    } else {
      objAcl.setReadAccess(acl.read, true)
    }
  }
  // 写控制
  if (acl.write) {
    if (acl.write === 'self') {
      objAcl.setWriteAccess(leanCloud.User.current(), true)
    } else if (acl.write === 'public') {
      objAcl.setPublicWriteAccess(true)
    } else if (acl.write === 'none') {
      objAcl.setPublicWriteAccess(false)
    } else if (acl.write instanceof Array) {
      acl.write.forEach(item => {
        if(item instanceof leanCloud.Role) {
          objAcl.setRoleWriteAccess(item, true)
        } else {
          objAcl.setWriteAccess(item, true)
        }
      })
    } else if(acl.write instanceof leanCloud.Role) {
      objAcl.setRoleWriteAccess(acl.write, true)
    } else {
      objAcl.setWriteAccess(acl.write, true)
    }
  }
  return objAcl
}

// 保存对象,默认仅自己可读自己可写
function saveObject(
  typeName: string, 
  value: {[key: string]: any }, 
  acl: AccessControl = {read: 'self', write: 'self'}
): Promise<leanCloud.Object> {
  var Obj = leanCloud.Object.extend(typeName)
  var instance = new Obj()
  Object.keys(value).forEach(item=> {
    instance.set(item, value[item])
  })
  if (acl) {
    instance.setACL(getAcl(acl))    
  }
  return instance.save()
}

// 获取query对象
function query(className: string): leanCloud.Query<leanCloud.Queriable>  {
  return new leanCloud.Query(className)
}

export default {
  ...leanCloud,
  saveObject,
  query
}