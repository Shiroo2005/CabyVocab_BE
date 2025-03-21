// src/swagger/index.ts
import YAML from 'yamljs'
import path from 'path'
import merge from 'deepmerge'

const loadYaml = (file: string) => YAML.load(path.join(__dirname, file))

// Nạp và hợp nhất các file YAML
const baseDoc = loadYaml('base.yml')
const roleDoc = loadYaml('role.yml')

// Hợp nhất tất cả tài liệu
export const swaggerSpec = merge.all([baseDoc, roleDoc])
