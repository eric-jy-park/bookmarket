const SharedUserPage = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  return <>{username}</>;
};

export default SharedUserPage;
