test("GET to /api/v1/status should return 200 and return database config status", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();
  expect(responseBody.dependencies.database.version).toBeDefined();
  expect(
    responseBody.dependencies.database.max_allowed_connections,
  ).toBeDefined();
  expect(
    responseBody.dependencies.database.current_opened_connections,
  ).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
  expect(responseBody.dependencies.database.version).toEqual("16.0");
  expect(
    responseBody.dependencies.database.max_allowed_connections,
  ).toBeGreaterThan(0);
  expect(responseBody.dependencies.database.current_opened_connections).toEqual(
    1,
  );
});
