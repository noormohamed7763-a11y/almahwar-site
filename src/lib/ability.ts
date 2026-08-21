import { Ability, AbilityBuilder, type AbilityTuple, createMongoAbility } from '@casl/ability'
import { createPrismaAbility } from '@casl/prisma'

export type AdminRole = 'admin' | 'editor' | 'viewer'
export type AdminAction = 'manage' | 'read' | 'create' | 'update' | 'delete'
export type AdminSubject = 'Project' | 'Service' | 'Article' | 'all'

export type AppAbility = Ability<[AdminAction, AdminSubject]>

export function defineAbilityFor(role: AdminRole = 'viewer'): AppAbility {
  const builder = new AbilityBuilder<AppAbility>(createPrismaAbility)

  if (role === 'admin') {
    builder.can('manage', 'all')
    return builder.build()
  }

  if (role === 'editor') {
    builder.can('read', 'all')
    builder.can('create', 'Project')
    builder.can('update', 'Project')
    builder.can('create', 'Service')
    builder.can('update', 'Service')
    builder.can('create', 'Article')
    builder.can('update', 'Article')
    builder.cannot('delete', 'all')
    return builder.build()
  }

  builder.can('read', 'all')
  builder.cannot('manage', 'all')
  return builder.build()
}

export const adminAbility = defineAbilityFor('admin')

// Backward-compatible alias for older CASL examples and future feature work.
export const defineAdminAbility = defineAbilityFor
export const simpleAbility = createMongoAbility
export type SubjectType = AdminSubject
export type AbilityAction = AdminAction
export type AbilityTupleType = AbilityTuple
