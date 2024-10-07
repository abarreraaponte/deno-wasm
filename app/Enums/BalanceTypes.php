<?php

namespace App\Enums;

enum BalanceTypes: string
{
    // Add cases without values
    case DEBIT = 'debit';
    case CREDIT = 'credit';
}
