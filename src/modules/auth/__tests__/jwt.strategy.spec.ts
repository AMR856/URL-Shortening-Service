import { JwtStrategy } from "../strategies/jwt.strategy";

describe("JwtStrategy", () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it("should be defined", () => {
    expect(strategy).toBeDefined();
  });

  it("should return validated user payload", async () => {
    const payload = { userId: 42, email: "test@example.com", role: "user" };

    const result = await strategy.validate(payload);

    expect(result).toEqual({
      userId: 42,
      email: "test@example.com",
    });
  });
});
