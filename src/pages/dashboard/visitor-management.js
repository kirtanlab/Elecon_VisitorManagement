import { Helmet } from 'react-helmet-async';
// sections
import VisitorView from 'src/sections/visitor-management/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Visitor Management</title>
      </Helmet>

      <VisitorView/>
    </>
  );
}
