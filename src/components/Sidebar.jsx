import { NavLink } from 'react-router-dom'
import { DOC_NAV } from '../data/nav.js'

export default function Sidebar({ id }) {
  return (
    <aside className="sidebar" id={id}>
      <nav>
        {DOC_NAV.map((group) => (
          <div key={group.group} className="sidebar__group">
            <div className="sidebar__group-title">{group.group}</div>
            <ul className="sidebar__list">
              {group.items.map((item) => (
                <li key={item.slug}>
                  <NavLink
                    to={`/docs/${item.slug}`}
                    className={({ isActive }) =>
                      'sidebar__link' + (isActive ? ' sidebar__link--active' : '')
                    }
                  >
                    {item.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
