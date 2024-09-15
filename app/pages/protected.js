// pages/protected.js
import { supabase } from '../lib/supabaseClient';

export default function ProtectedPage() {
  return <h1>This is a protected page!</h1>;
}

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return { props: {}, redirect: { destination: '/login', permanent: false } };
  }

  return { props: { user } };
}
