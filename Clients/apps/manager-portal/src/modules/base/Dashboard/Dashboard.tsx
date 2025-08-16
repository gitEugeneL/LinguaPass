import { formatElapsedTime, LoaderIndicator } from '@clients/shared';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { StudentCard } from '../../../componets';
import { useCourseStore, useStudentStore } from '../../../store';
import { StatusArea } from '../../../widgets';

import { MiniDashboardCard } from './components';
import styles from './Dashboard.module.pcss';

export function Dashboard() {
  const [elapsedTime, setElapsedTime] = useState<string>('');

  const navigate = useNavigate();

  const { dashboardCourse, getDashboardDataCourse, courseLoading } = useCourseStore(
    useShallow((state) => ({
      dashboardCourse: state.dashboard,
      getDashboardDataCourse: state.getDashboardData,
      courseLoading: state.isLoading
    }))
  );

  const { students, dashboardStudent, getDashboardDataStudent, getAllStudents, studentLoading } =
    useStudentStore(
      useShallow((state) => ({
        students: state.students,
        dashboardStudent: state.dashboard,
        getDashboardDataStudent: state.getDashboardData,
        getAllStudents: state.getAllStudents,
        studentLoading: state.isLoading
      }))
    );

  useEffect(() => {
    getDashboardDataCourse();
    getDashboardDataStudent();
  }, []);

  useEffect(() => {
    getAllStudents(true);
  }, []);

  useEffect(() => {
    if (dashboardStudent?.lastUpdated) {
      setElapsedTime(formatElapsedTime(new Date(dashboardStudent?.lastUpdated)));
    }
  }, [dashboardStudent?.lastUpdated]);

  const handleStudentDetail = (studentId: string) => {
    navigate(`/students/current/${studentId}`);
  };

  return (
    <>
      <StatusArea name='Home' />

      <div className={styles.wrapper}>
        <div className={styles.miniContainer}>
          <MiniDashboardCard
            value={dashboardStudent?.currentApplicationCount.toString()}
            subName='Current applications'
            isLoading={studentLoading}
          />
          <MiniDashboardCard
            value={dashboardStudent?.archivedApplicationCount.toString()}
            subName='Archived applicatios'
            isLoading={studentLoading}
          />
          <MiniDashboardCard
            value={elapsedTime}
            subName='Last student update'
            isLoading={studentLoading}
          />
        </div>
        <div className={styles.container}>
          <MiniDashboardCard
            value={dashboardCourse?.countryCount.toString()}
            subName='Number of countries'
            isLoading={courseLoading}
          />
          <MiniDashboardCard
            value={dashboardCourse?.schoolCount.toString()}
            subName='Number of schools'
            isLoading={courseLoading}
          />
          <MiniDashboardCard
            value={dashboardCourse?.courseCount.toString()}
            subName='Number of courses'
            isLoading={courseLoading}
          />
          <MiniDashboardCard
            value={dashboardCourse?.topCountry.toString()}
            subName='Top country'
            isLoading={courseLoading}
          />
        </div>

        <h2 className={styles.title}>Last students</h2>

        <div className={styles.content}>
          {studentLoading && <LoaderIndicator width={150} height={150} />}
          {!studentLoading &&
            students.length > 0 &&
            students.slice(0, 8).map((student) => (
              <div key={student.accountId} onClick={() => handleStudentDetail(student.accountId)}>
                <StudentCard
                  name={student.name}
                  surname={student.surname}
                  schoolId={student.schoolId}
                  languageId={student.languageId}
                  updatedAt={student.updatedAt ? student.updatedAt : student.createdAt}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
