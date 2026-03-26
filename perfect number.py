n = int(input("Input the number : "))
sum = 0

print("The positive divisor :", end=" ")
for i in range(1, n):
    if n % i == 0:
        print(i, end=" ")
        sum = sum + i

print("\nThe sum of the divisor is :", sum)

if sum == n:
    print("So, the number is perfect.")
else:
    print("So, the number is not perfect.")
