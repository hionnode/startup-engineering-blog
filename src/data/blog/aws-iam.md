---
author: Chinmay
pubDatetime: 2025-03-20T15:22:00Z
modDatetime: 2025-03-20T15:22:00Z
title: setting up iam
slug: aws-iam
featured: true
draft: false
tags:
  - docs
description:
    setting up iam
---


# IAM Essentials: Securing Your AWS Environment from Day One

Welcome to the second installment in our series designed to help startups navigate the world of AWS! In our [first post](aws-101), we covered the basics of setting up an AWS account. Today, we're diving into a crucial aspect of AWS security: **Identity and Access Management (IAM)**.

Imagine IAM as the bouncer at the door of your AWS resources. It controls who gets in and what they're allowed to do once inside. Setting up IAM correctly from the start is paramount for protecting your sensitive data and preventing unauthorized access.

## What is IAM?

AWS Identity and Access Management (IAM) allows you to manage access to AWS services and resources securely. You use IAM to control *who* is authenticated (signed in) and *authorized* (has permissions) to use resources.

Here’s a breakdown of the core concepts:

*   **Users:**  These represent individual people or applications that need to access your AWS resources.  Think of them as your employees or automated scripts. **Important: NEVER use your AWS root account for day-to-day tasks. We'll explain why shortly.**

*   **Groups:** A collection of IAM users. Groups make it easier to manage permissions for multiple users at once.  For example, a "Developers" group could have permissions to launch EC2 instances and write code to S3.

*   **Roles:** Similar to users, but designed to be assumed by AWS services (like EC2 instances or Lambda functions) or other AWS accounts. Roles grant temporary permissions to perform actions. Think of it as a temporary badge allowing a service to do specific tasks.

*   **Policies:** Define permissions. A policy is a document that specifies what actions are allowed or denied on which resources.  Policies are attached to users, groups, or roles. Think of it as the rules the bouncer enforces.

IAM helps you control access by defining *who* (user, group, or role) can access *what* (AWS resources like S3 buckets, EC2 instances, databases) and *how* (what actions they can perform, like read, write, delete).

## Why is IAM Important?

IAM is the cornerstone of security in AWS. Without it, anyone with access to your AWS credentials could potentially:

*   Access sensitive data (customer information, financial records).
*   Launch expensive resources (leading to unexpected bills).
*   Delete critical infrastructure (causing downtime and data loss).
*   Compromise your entire environment.

The core principle behind IAM is **least privilege**. This means granting users (and services) only the *minimum* permissions they need to perform their jobs. For example, a developer who only needs to read logs from an S3 bucket shouldn't have permission to delete the entire bucket. Applying the principle of least privilege minimizes the potential damage from compromised credentials or malicious insiders.

## IAM Users vs. Root Account

**Repeat after me: NEVER use the AWS root account for day-to-day tasks!**

Your root account is created when you first sign up for AWS.  It has complete, unrestricted access to *all* AWS services and resources. This is incredibly powerful, but also incredibly risky. If your root account credentials are compromised, your entire AWS environment is at risk.

Imagine leaving the keys to your entire company, including the CEO's office, lying on the street. That's essentially what you're doing by using your root account for regular tasks.

Instead, create IAM users with limited permissions for each individual who needs access to your AWS environment. Use the root account *only* for tasks that require it, such as changing your account settings or managing billing.

## IAM Groups

IAM groups make managing permissions for multiple users much easier.  Instead of attaching policies to each individual user, you attach policies to a group, and then add users to that group.

Here's how it works:

1.  **Create an IAM Group:**  For example, "Developers," "SysAdmins," or "DatabaseAdmins."
2.  **Attach Policies to the Group:** Define the permissions that members of that group should have.
3.  **Add Users to the Group:**  Assign users to the appropriate groups based on their roles.

**Example IAM Groups and Permissions:**

*   **Developers:**  Permissions to launch EC2 instances, manage S3 buckets (within defined boundaries), deploy code, and access CloudWatch logs.
*   **SysAdmins:**  Permissions to manage EC2 instances, configure networking (VPC, subnets), and monitor system performance.
*   **DatabaseAdmins:**  Permissions to manage RDS databases, perform backups, and monitor database performance.
*   **ReadOnly:** Permissions to read most services, and view Cloudwatch metrics. This is an excellent group to put auditors or executive management into.

**This approach simplifies user management and ensures consistent permissions across your team.**

## IAM Policy Example (Read-Only S3 Access)

This policy allows users to list buckets and get objects in a specific S3 bucket.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowListingOfUserFolder",
            "Effect": "Allow",
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::your-bucket-name",
            "Condition": {
                "StringLike": {
                    "s3:prefix": [
                        "home/${aws:username}/*",
                        "home/${aws:username}"
                    ]
                }
            }
        },
        {
            "Sid": "AllowAllS3ActionsInUserFolder",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name/home/${aws:username}/*"
        }
    ]
}
```

### Explanation:

- Version: Specifies the version of the policy language. Always use "2012-10-17".

- Statement: An array of individual policy statements.

- Sid: A statement ID (optional, but good for organization).

- Effect: Either "Allow" or "Deny". Determines whether the policy grants or denies access.

- Action: The specific AWS action being allowed or denied (e.g., s3:ListBucket, s3:GetObject). Refer to the AWS documentation for a complete list of actions.

- Resource: The AWS resource that the policy applies to (e.g., arn:aws:s3:::your-bucket-name). Use the ARN (Amazon Resource Name) to identify the resource.

- Condition: Sets out extra contraints on when the policy is applicable.

Remember to replace arn:aws:s3:::your-bucket-name with the actual ARN of your S3 bucket.

## IAM Roles
IAM roles are a powerful way to grant permissions to AWS services and applications. Unlike IAM users, roles aren't associated with specific individuals or permanent credentials. Instead, they provide temporary permissions that a service or application can assume.

Use Cases for IAM Roles:

- EC2 Instances: Allow an EC2 instance to access S3 buckets, DynamoDB tables, or other AWS services without storing AWS credentials on the instance itself.

- Lambda Functions: Grant a Lambda function permissions to read data from a database, write logs to CloudWatch, or invoke other AWS services.

- Cross-Account Access: Allow users or services in one AWS account to access resources in another account.

## IAM Role Trust Policy Example (EC2 Instance)
This trust policy allows an EC2 instance to assume the role.
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```
### Explanation:

- Principal: Specifies the entity that is allowed to assume the role. In this case, it's the ec2.amazonaws.com service. This means any EC2 instance can assume this role, if it's associated with the instance profile that includes this role.

- Action: sts:AssumeRole is the action that allows the principal to assume the role.

## IAM Policies: Managed vs. Inline
There are two types of IAM policies:

- Managed Policies: Standalone policies that you can attach to multiple users, groups, or roles. They are stored in AWS and can be updated independently. AWS Managed Policies are created and maintained by AWS and are a good starting point for common use cases. Customer Managed Policies are created and maintained by you, giving you more control.

- Inline Policies: Policies that are embedded directly within a single user, group, or role. They are not reusable and cannot be updated independently.

### When to use Managed vs. Inline Policies:

- Use Managed Policies when you need to apply the same permissions to multiple users, groups, or roles. This promotes consistency and simplifies management.

- Use Inline Policies when you need to grant unique permissions to a single user, group, or role, and you don't need to reuse those permissions elsewhere.

### Example: Managed Policy (Customer Managed)

This Customer Managed Policy grants an administrator full access to EC2.
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "ec2:*",
            "Resource": "*"
        }
    ]
}
```
### Example: Inline Policy

This Inline Policy, attached directly to a user, allows them to access a specific Secrets Manager Secret.
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:DescribeSecret",
                "secretsmanager:GetSecretValue",
                "secretsmanager:ListSecretVersionIds"
            ],
            "Resource": "arn:aws:secretsmanager:us-east-1:123456789012:secret:my-secret-name-abcdef"
        }
    ]
}
```
## Best Practices
- Enforce multi-factor authentication (MFA) for all IAM users. MFA adds an extra layer of security by requiring users to provide a code from their phone or a security key in addition to their password.

- Use strong passwords for IAM users. Enforce password complexity requirements to prevent brute-force attacks.

- Regularly review and update IAM policies. As your infrastructure and application evolve, your IAM policies may need to be adjusted.

- Monitor IAM activity for suspicious behavior. Use AWS CloudTrail to log all IAM activity and set up alerts for unusual events.

- Automate IAM tasks using Infrastructure as Code (IaC). Use tools like Terraform or CloudFormation to define and manage your IAM resources programmatically. This allows you to version control your IAM configuration and automate the process of creating and updating users, groups, and roles. (Stay tuned for a future blog post on IaC!)

## Gotchas
- Accidentally granting overly permissive access. Always follow the principle of least privilege.

- Failing to regularly review and update IAM policies. Policies become stale over time.

- Not using MFA for all IAM users. This is one of the biggest security risks.

- Losing track of IAM users and roles. Regularly audit your IAM configuration to ensure that all users and roles are still necessary and have the appropriate permissions.

## Team Management & Repeatable Onboarding
Onboarding new users with the correct permissions can be challenging. To make this process repeatable and secure, create a documented checklist.

Here's a suggested process:

- Create a new IAM user: Follow the steps outlined in the AWS documentation.

- Assign the user to appropriate IAM groups: Based on their role in the organization.

- Enforce MFA: Ensure the user sets up MFA upon their first login.

- Provide temporary password and instructions: Communicate the temporary password securely and instruct the user to change it immediately.

- Document the process: Keep a record of the user's creation and group assignments.

### IAM User Checklist:

Use the following checklist when creating a new IAM user:

## New IAM User Checklist

**User Information:**

*   **Full Name:** _________________________
*   **Email Address:** _________________________
*   **Job Title:** _________________________

**IAM Configuration:**

*   **IAM Username:** _________________________
*   **Group Assignments:**
    *   [ ] Developers
    *   [ ] SysAdmins
    *   [ ] DatabaseAdmins
    *   [ ] ReadOnly
    *   [ ] Other: _________________________
*   **Temporary Password:** _________________________ (Communicate Securely)
*   **MFA Enabled?** [ ] Yes  [ ] No (Verify after initial login)

**Post-Creation Steps:**

*   [ ] User notified of account creation and temporary password.
*   [ ] User instructed to change password upon first login.
*   [ ] MFA setup verified after initial login.
*   [ ] Documentation updated with user information and group assignments.

**Notes:**

_________________________________________________________________________
_________________________________________________________________________


## Conclusion
IAM is a critical component of your AWS security posture. By following the best practices outlined in this post, you can secure your AWS environment from day one and protect your sensitive data. Remember to prioritize least privilege, enforce MFA, and regularly review your IAM configuration.

We hope this post has been helpful! Please leave your comments and questions below. In our next post, we'll delve deeper into [link to next blog post topic].

