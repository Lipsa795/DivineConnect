import sys
input = sys.stdin.readline
MOD = 10**9 + 7

t = int(input())
arr = [int(input()) for _ in range(t)]
mx = max(arr)

dp = [0] * (mx + 1)

dp[1] = 2
if mx >= 2:
    dp[2] = 3

for i in range(3, mx + 1):
    dp[i] = (dp[i-1] + dp[i-2]) % MOD

print("\n".join(str(dp[n]) for n in arr))