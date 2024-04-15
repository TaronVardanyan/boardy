'use client'

import { useOrganizationList } from '@clerk/nextjs'
import Item from './item'

const List = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  })

  return !!userMemberships.data.length ? (
    <ul className="space-y-4">
      {userMemberships.data.map((mem) => (
        <Item
          key={mem.organization.id}
          name={mem.organization.name}
          id={mem.organization.id}
          imageUrl={mem.organization.imageUrl}
        />
      ))}
    </ul>
  ) : null
}

export default List
