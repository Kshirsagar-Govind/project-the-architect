import { FiBriefcase, FiUser, FiUsers } from "react-icons/fi"
import { projectStatusStyles } from "./statusColorMap"
import { NavLink } from "react-router-dom"

type Props = {
  role: string;
  project: any
}

export default function ProjectCard({ role, project }: Props) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all ease-linear">

      {/* Header */}
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg text-gray-900">
          {project.title}
        </h3>

        <span
          className={`px-3 py-1 text-xs font-medium rounded-full capitalize
          ${projectStatusStyles[project.status]}`}
        >
          {project.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
        {project.desc}
      </p>
      {/* Meta Info */}
      <div className="mt-4 space-y-2 text-sm text-gray-600">

        <div className="flex items-center gap-2">
          <FiBriefcase className="text-primary-dark" />
          <span>
            <b>Client:</b> {project.client?.company}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FiUser className="text-primary-dark" />
          <span>
            <b>Manager:</b> {project.manager?.name || "Not Assigned"}
          </span>
        </div>

      </div>

      {/* Members */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
          <FiUsers className="text-primary-dark" />
          <span><b>Testers</b></span>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.members.length > 0 ? (
            project.members.map((m: any) => (
              <span
                key={m._id}
                className="text-xs bg-gray-100 px-2 py-1 rounded-full"
              >
                {m.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-primary-dark">No testers assigned</span>
          )}
        </div>
      </div>

      <div className="">

        <NavLink
          className={'pl-5 inline-flex items-center py-2 w-full h-full'}
          to={`/${role == 'MANAGER' ? 'manager' : 'tester'}/overview/${project._id}`}>
          Go to</NavLink>
      </div>

    </div>
  )
}
