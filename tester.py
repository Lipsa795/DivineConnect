import sys
input = sys.stdin.readline

MOD = 10**9 + 7
N = 2000

# factorial
f = [1]*(N+1)
for i in range(1, N+1):
    f[i] = f[i-1]*i % MOD

# inverse factorial
inv = [1]*(N+1)
inv[N] = pow(f[N], MOD-2, MOD)
for i in range(N, 0, -1):
    inv[i-1] = inv[i]*i % MOD

# queries
t = int(input())
for _ in range(t):
    n, r = map(int, input().split())
    if r > n:
        print(0)
    else:
        print(f[n] * inv[r] % MOD * inv[n-r] % MOD)