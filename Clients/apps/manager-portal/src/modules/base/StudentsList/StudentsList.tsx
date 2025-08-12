import { Button, LoaderIndicator } from '@clients/shared';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { Paginator } from '../../../componets';
import { useStudentStore } from '../../../store';
import { StatusArea } from '../../../widgets';

import { StudentCard } from './components';
import styles from './StudentsList.module.pcss';
import type { StudentsListProps } from './StudentsList.props.ts';

export function StudentsList({ ...props }: StudentsListProps) {
  const navigate = useNavigate();

  const { students, getAllStudents, isLoading, paginator } = useStudentStore(
    useShallow((state) => ({
      students: state.students,
      getAllStudents: state.getAllStudents,
      isLoading: state.isLoading,
      paginator: state.paginator
    }))
  );

  useEffect(() => {
    getAllStudents(props.type === 'current');
  }, []);

  const handlePageChange = (page: number) => {
    getAllStudents(props.type === 'current', page);
  };

  const handleRefresh = () => {
    getAllStudents(props.type === 'current');
  };

  const handleDetail = (studentId: string) => {
    navigate(`/students/${props.type === 'current' ? 'current' : 'archived'}/${studentId}`);
  };

  return (
    <>
      <StatusArea name='Current students'>
        <Button name='Refresh' size='small' onClick={handleRefresh} />
      </StatusArea>
      <div className={styles.container}>
        {isLoading && <LoaderIndicator width={150} height={150} />}

        {!isLoading &&
          students.length > 0 &&
          students.map((student) => (
            <div key={student.accountId} onClick={() => handleDetail(student.accountId)}>
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

      {paginator && paginator.totalPages > 1 && !isLoading && (
        <Paginator
          pageNumber={paginator.pageNumber}
          totalPages={paginator.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}
