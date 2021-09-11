import { RedisAuthService } from "./redis/redisAuthService";
import { redisConnection } from "./redis/redisConnection";

const authService = new RedisAuthService(redisConnection);

// authService.getTokens('blahblah@gmail.com')
// .then((t) => console.log(t))
// .catch((err) => console.log(err))

export { authService };
